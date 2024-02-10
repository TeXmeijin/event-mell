import { db } from "@/db";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { createEventDraftPrivate } from "@/trpc/createEventDraftPrivate";
import { getMyEventDraftsPrivate } from "@/trpc/getMyEventDraftsPrivate";
import { authCallback } from "@/trpc/authCallback";
import { addReactionToEventDraftPrivate } from "@/trpc/addReactionToEventDraftPrivate";
import { createConnpassPageCreatedEventPrivate } from "@/trpc/createConnpassPageCreatedEventPrivate";

export const appRouter = router({
  // eventDraft
  createEventDraft: createEventDraftPrivate,
  getMyEventDrafts: getMyEventDraftsPrivate,
  addReactionToEventDraft: addReactionToEventDraftPrivate,
  createConnpassPageCreatedEvent: createConnpassPageCreatedEventPrivate,

  // Authentication
  authCallback: authCallback,
  getUser: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    const profiles = await db.user.findMany({
      where: { id: userId },
      select: {
        id: true,
        fullname: true,
      },
    });
    return profiles;
  }),
  countUser: publicProcedure.query(async () => {
    const totalUsers = await db.user.count();
    return totalUsers;
  }),
});

export type AppRouter = typeof appRouter;
