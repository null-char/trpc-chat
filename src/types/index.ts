import { Msg } from "@prisma/client";
import z from "zod";

export const messageSchema = z.object({
  id: z.string(),
  text: z.string(),
  timestamp: z.date(),
  hasImage: z.optional(z.boolean()),
  imageUrl: z.optional(z.string()),
});

export type Message = z.infer<typeof messageSchema>;
