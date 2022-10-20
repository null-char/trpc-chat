import React from "react";
import { Message } from "~/types";
import { trpc } from "~/utils/trpc";
import { MessageItem } from "../MessageItem/MessageItem";

interface MessageListProps {
  queuedMessages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ queuedMessages }) => {
  // Only fetch once. Data is then handled by FE.
  const { data: messages, isFetching } = trpc.msg.list.useQuery(undefined, {
    staleTime: Infinity,
  });
  // Scroll to bottom when a queued message is added
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(
    () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
    [queuedMessages]
  );

  return isFetching ? (
    <div className="flex-grow">
      <p className="text-white">Loading...</p>
    </div>
  ) : (
    <ul className="flex flex-grow flex-col space-y-4 overflow-y-auto py-3 scrollbar-thin scrollbar-track-background-secondary scrollbar-thumb-darker-background scrollbar-track-rounded scrollbar-thumb-rounded">
      {messages?.map((message) => (
        <li key={message.id}>
          <MessageItem message={message} />
        </li>
      ))}
      {queuedMessages.map((queuedMessage) => (
        <li key={queuedMessage.id}>
          <MessageItem message={queuedMessage} loading />
        </li>
      ))}

      <div ref={messagesEndRef} />
    </ul>
  );
};
