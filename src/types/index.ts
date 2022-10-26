import { Msg } from "@prisma/client";

export type Message = Msg & { imageUrl?: string };
