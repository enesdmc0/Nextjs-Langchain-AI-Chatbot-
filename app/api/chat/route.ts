import {LangChainStream, StreamingTextResponse, Message as VercelChatMessage} from "ai";
import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate, MessagesPlaceholder, PromptTemplate} from "@langchain/core/prompts";
import {createStuffDocumentsChain} from "langchain/chains/combine_documents";
import {getVectorStore} from "@/lib/astradb";
import {createRetrievalChain} from "langchain/chains/retrieval";
import {AIMessage, HumanMessage} from "@langchain/core/messages";
import {UpstashRedisCache} from "@langchain/community/caches/upstash_redis";
import {Redis} from "@upstash/redis";
import {createHistoryAwareRetriever} from "langchain/chains/history_aware_retriever";

export async function POST(req :Request) {
    try{
        const {messages} = await req.json()

        const chatHistory = messages
            .slice(0,-1)
            .map((m: VercelChatMessage) =>
            m.role === "user"
            ? new HumanMessage(m.content)
        : new AIMessage(m.content))

        const currentMessageContent = messages[messages.length - 1].content

        const cache = new UpstashRedisCache({
            client: Redis.fromEnv()
        })

        const {stream, handlers} = LangChainStream()


        const chatModel = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
            verbose: true,
            cache,
        })

        const rephrasingModel =  new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
            verbose: true,
            cache,

        })

        const retriever = (await getVectorStore()).asRetriever()

        const rephrasePrompt = ChatPromptTemplate.fromMessages([
            new MessagesPlaceholder("chat_history"),
            ["user", "{input}"],
            [
                "user",
                "Given the above conversation, generate a search query to look up in order to get information relevant to the current question. " +
                "Don't leave out any relevant keywords. Only return the query and no other text.",
            ]
        ])

        const historyAwareRetrieverChain = await createHistoryAwareRetriever({
            llm: rephrasingModel,
            retriever,
            rephrasePrompt
        })

        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                "You are a chatbot for a personal portfolio website. You impersonate the website's owner. " +
                "Answer the user's questions based on the below context. " +
                "Whenever it makes sense, provide links to pages that contain more information about the topic from the given context. " +
                "Format your messages in markdown format.\n\n" +
                "Context:\n{context}",
            ],
            new MessagesPlaceholder("chat_history"),
            [
                "user", "{input}"
            ]
        ])

        const combineDocsChain = await createStuffDocumentsChain({
            llm: chatModel,
            prompt,
            documentPrompt: PromptTemplate.fromTemplate(
                "Page URL: {url}\n\nPage_content:\n{page_content}"
            ),
            documentSeparator: "\n----------\n"
        })


        const retrievelChain = await createRetrievalChain({
            combineDocsChain,
            retriever: historyAwareRetrieverChain,
        })

        retrievelChain.invoke({
            input: currentMessageContent,
            chat_history: chatHistory
        })


        return new StreamingTextResponse(stream)


    }catch (error){
        console.log(error)
        return Response.json({error: "Internal Server error!"}, {status: 500})
    }
}