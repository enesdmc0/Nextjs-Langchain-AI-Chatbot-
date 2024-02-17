import OpenAI from "openai";
import {ChatCompletionSystemMessageParam} from "ai/prompts";
import {LangChainStream, OpenAIStream, StreamingTextResponse} from "ai";
import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";

export async function POST(req :Request) {
    try{
        const {messages} = await req.json()

        const currentMessageContent = messages[messages.length - 1].content

        const {stream, handlers} = LangChainStream()
        const chatModel = new ChatOpenAI({
            modelName: "gpt-3.5-turbo",
            streaming: true,
            callbacks: [handlers]
        })

        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                "You are a sarcasm bot. You answer all user questions in a sarcastic manner."
            ],
            [
                "user", "{input}"
            ]
        ])

        const chain = prompt.pipe(chatModel)

        chain.invoke({
            input: currentMessageContent
        })


        return new StreamingTextResponse(stream)


    }catch (error){
        console.log(error)
        return Response.json({error: "Internal Server error!"}, {status: 500})
    }
}