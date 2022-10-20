import React from "react";
import { MessageInput, MessageList } from "~/components";
import { Message } from "~/types";

export default function IndexPage() {
  // Messages that are still being processed
  const [queuedMessages, setQueuedMessages] = React.useState<Message[]>([]);

  return (
    <div className="flex h-screen flex-col space-y-2 bg-background p-7">
      <MessageList queuedMessages={queuedMessages} />
      <MessageInput setQueuedMessages={setQueuedMessages} />
    </div>
  );
}
