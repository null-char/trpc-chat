import { useState } from "react";
import { createContainer } from "unstated-next";
import { Message } from "~/types";

// Messages that are still being processed
function useQueuedMessages(initialState = []) {
  const [list, setList] = useState<Message[]>(initialState);
  const add = (message: Message) => {
    setList((list) => [...list, message]);
  };
  const remove = (idToRemove: string) => {
    setList((list) => list.filter((message) => message.id !== idToRemove));
  };

  return { list, add, remove };
}

export const QueuedMessages = createContainer(useQueuedMessages);
