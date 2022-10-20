import { router } from "../trpc";
import { msgRouter } from "./msg";

const appRouter = router({
  msg: msgRouter,
});

export default appRouter;
