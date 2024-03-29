import React, {useEffect, useRef} from "react";
import { Message, useChat } from "ai/react";
import { cn } from "@/lib/utils";
import {Bot, SendHorizonal, Trash, XCircle} from "lucide-react";
import ReactMarkDown from "react-markdown";
import Link from "next/link";
interface Props {
  open: boolean;
  onClose: () => void;
}

const AIChatBox: React.FC<Props> = ({ open, onClose }) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat();

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

    useEffect(() => {
        if (open) {
        inputRef.current?.focus()
        }
    }, [open])

  const lastMessageIsUser = messages[messages.length - 1]?.role === "user"

  return (
    <div
      className={cn(
        "bottom-0 right-0 z-50 w-full max-w-[500px] p-1 xl:right-36",
        open ? "fixed" : "hidden",
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={24} className="rounded-full bg-background" />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div ref={scrollRef} className="mt-3 h-full overflow-y-auto px-3">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && lastMessageIsUser && (
              <ChatMessage message={{
                id: "loading",
                role: "assistant",
                content: "Thinking..."
              }}/>
          )}
          { error && (
              <ChatMessage message={{
                id: "error",
                role: "assistant",
                content: "Something went wrong. Please try again later."
              }} />
          )}
          {!error && messages.length === 0 && (
              <div className="flex items-center justify-center h-full flex-col gap-3 text-center">
                <Bot size={28} />
                <p className="font-medium text-lg">Send a message to start the AI chat! </p>
                <p className="">You can ask the chatbot any question about me and it will find the relevant information on this website.</p>
                <p className="text-sm text-muted-foreground">
                  PS: If you want to learn how to build your own AI chatbot, check out the <a className="text-primary hover:underline" href="https://www.youtube.com/c/codinginflow">tutorial on the Coding in Flow YouTube channel</a> .
                </p>
              </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <button className="flex items-center justify-center w-10 flex-none"
                  title="Clear Chat!" type="button"
                  onClick={() => setMessages([])} >
            <Trash size={24} />
          </button>
          <input ref={inputRef}
              type="text"
                 value={input}
                 onChange={handleInputChange}
                 placeholder="Type a message..."
                 className="grow border rounded bg-background px-3 py-2"
          />
          <button className="flex items-center justify-center w-10 flex-none disabled:opacity-50"
          disabled={input.length === 0}
                  title="Send Message!" type="submit"
          >
            <SendHorizonal size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatBox;

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message: { role, content },
}) => {
  const isAiMessage = role === "assistant";
  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end",
      )}
    >
      {isAiMessage && <Bot className="mr-2 flex-none" />}
      <div className={cn("rounded-md border px-3 py-2", isAiMessage ? "bg-background" : "bg-foreground text-background")}>
      <ReactMarkDown
      components={{
        a: ({node, ref, ...props}) => (
            <Link {...props} href={props.href ?? ""} className="text-primary hover:underline"/>
        ),
        p: ({node, ...props}) => (
            <p {...props} className="mt-3 first:mt-0" />
        ),
        ul: ({node, ...props}) => (
            <ul {...props} className="mt-3 first:mt-0 list-inside list-disc" />
        ),
        li: ({node, ...props}) => (
            <li {...props} className="mt-1" />
        )
      }}
      >{content}</ReactMarkDown>
      </div>
    </div>
  );
};
