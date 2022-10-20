import React from "react";
import { Message } from "~/types";
import { trpc } from "~/utils/trpc";
import XCircle from "public/icons/x-circle.svg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface MessageItemProps {
  message: Message;
  loading?: boolean;
}

const TIMESTAMP_UPDATE_INTERVAL = 60 * 1000;

export const MessageItem: React.FC<MessageItemProps> = (props) => {
  const { message, loading } = props;

  const formatTimestamp = (timestamp: Date) => {
    const now = dayjs(Date.now());
    if (now.diff(timestamp, "days") > 1) {
      return dayjs(timestamp).format("ddd MMM DD - hh:mmA");
    }
    return dayjs(timestamp).fromNow();
  };
  const [timestamp, setTimestamp] = React.useState(
    formatTimestamp(message.timestamp)
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimestamp(formatTimestamp(message.timestamp));
    }, TIMESTAMP_UPDATE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const deleteMessage = trpc.msg.delete.useMutation({
    onMutate: ({ id }) => {
      const allMessages = utils.msg.list.getData();
      if (!allMessages) return;

      utils.msg.list.setData(
        allMessages.filter((message) => message.id !== id)
      );
    },
  });
  const utils = trpc.useContext();

  const onDelete = () => {
    deleteMessage.mutate({ id: message.id });
  };

  return (
    <div
      className={`group relative mr-3 flex w-fit max-w-prose flex-col space-y-1 break-words rounded-md bg-background-secondary p-2 ${
        loading && "opacity-50"
      }`}
    >
      <div className="flex flex-col space-y-2">
        <p className="whitespace-pre-wrap text-white">{message.text}</p>

        {message.imageUrl && (
          <img
            className="max-h-[300px] max-w-full  rounded-md object-contain"
            src={message.imageUrl}
          />
        )}
      </div>

      {!loading && (
        <>
          <div
            className="absolute -right-2 -top-4 hidden w-fit cursor-pointer rounded-full bg-background p-0 group-hover:block"
            onClick={onDelete}
          >
            <XCircle width={20} height={20} color="white" />
          </div>

          <p className="text-xs text-white opacity-60">{timestamp}</p>
        </>
      )}
    </div>
  );
};
