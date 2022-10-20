import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../utils/prisma";

export const createContext = async (
  options?: trpcNext.CreateNextContextOptions
) => {
  return {
    req: options?.req,
    prisma,
    msg: prisma.msg,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
