import {
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { z } from "zod";
import { Message } from "~/types";
import { generateSignedURL } from "~/utils/s3";
import { publicProcedure, router } from "../trpc";

export const msgRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    const messages = await ctx.msg.findMany({
      orderBy: {
        timestamp: "asc",
      },
    });
    const messagesWithImages: Message[] = await Promise.all(
      messages.map(async (message) => {
        let imageUrl;
        if (message.hasImage) {
          imageUrl = await generateSignedURL(message.id, GetObjectCommand);
        }
        const msg: Message = {
          ...message,
          imageUrl,
        };
        return msg;
      })
    );
    return messagesWithImages;
  }),
  add: publicProcedure
    .input(
      z.object({
        text: z.string().trim().min(1),
        hasImage: z.optional(z.boolean()),
        imageDimensions: z.optional(
          z.object({
            height: z.number(),
            width: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const msg = await ctx.msg.create({
        data: {
          hasImage: !!input.hasImage,
          text: input.text,
          timestamp: new Date(),
          imageHeight: input.imageDimensions?.height,
          imageWidth: input.imageDimensions?.width,
        },
      });

      let uploadUrl;
      if (input.hasImage) {
        uploadUrl = await generateSignedURL(msg.id, PutObjectCommand);
      }
      return { message: msg, uploadUrl };
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const msg = await ctx.msg.delete({ where: { id: input.id } });
      if (msg.hasImage) {
        const signedUrl = await generateSignedURL(msg.id, DeleteObjectCommand);
        await fetch(signedUrl, { method: "DELETE" });
      }
      return msg;
    }),
});
