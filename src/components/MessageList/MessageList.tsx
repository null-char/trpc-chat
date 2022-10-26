import React from "react";
import { useResizeObserver } from "~/hooks/use-resize-observer";
import { QueuedMessages } from "~/state/queuedMessages";
import { trpc } from "~/utils/trpc";
import { MessageItem } from "../MessageItem/MessageItem";

export const MessageList: React.FC = () => {
  // Only fetch once. Data is then handled by FE.
  const { data: messages, isFetching } = trpc.msg.list.useQuery(undefined, {
    staleTime: Infinity,
  });
  const queuedMessages = QueuedMessages.useContainer();
  // Do not auto scroll when messages are deleted
  const [prevHeight, setPrevHeight] = React.useState(0);

  // Scroll to bottom when a new message is added
  let listRef = React.useRef<HTMLUListElement>(null);
  useResizeObserver(listRef, () => {
    if (listRef.current) {
      if (listRef.current.scrollHeight > prevHeight) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
      setPrevHeight(listRef.current.scrollHeight);
    }
  });

  const scrollBarStyles =
    "scrollbar-thin scrollbar-track-background-secondary scrollbar-thumb-darker-background scrollbar-track-rounded scrollbar-thumb-rounded";

  return (
    <ul
      ref={listRef}
      className={`flex flex-grow flex-col space-y-4 overflow-y-auto py-3 ${scrollBarStyles}`}
    >
      {isFetching ? (
        <li className="flex-grow">
          <p className="text-white">Loading...</p>
        </li>
      ) : (
        <>
          {messages?.map((message) => (
            <li key={message.id}>
              <MessageItem message={message} />
            </li>
          ))}
          {queuedMessages.list.map((queuedMessage) => (
            <li key={queuedMessage.id}>
              <MessageItem message={queuedMessage} loading />
            </li>
          ))}
        </>
      )}
    </ul>
  );
};
