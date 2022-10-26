import dynamic from "next/dynamic";

export * from "./MessageItem/MessageItem";
export * from "./MessageInput/MessageInput";
export * from "./MessageList/MessageList";
export const MessageList = dynamic(
  () => import("./MessageList/MessageList").then((mod) => mod.MessageList),
  { ssr: false }
);
