import React from "react";
import { MessageInput, MessageList } from "~/components";
import { QueuedMessages } from "~/state/queuedMessages";

export default function IndexPage() {
  return (
    <div className="flex h-screen flex-col space-y-2 bg-background p-7">
      <QueuedMessages.Provider>
        <MessageList />
        <MessageInput />
      </QueuedMessages.Provider>
    </div>
  );
}
