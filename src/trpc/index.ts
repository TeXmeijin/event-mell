import { db } from "@/db";
import { getUserEmail } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import crypto from "crypto";

const generateUUID = () => {
  return crypto.randomUUID();
};

export const appRouter = router({
  testroute: publicProcedure.query(() => "Say this is test route!"),

  authCallback: publicProcedure.query(async () => {
    const user = await currentUser();

    const email = getUserEmail(user);

    if (!user?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: email,
          image: user.imageUrl,
          username: user.username || null,
          fullname: `${user.firstName} ${user.lastName}`,
        },
      });
    }
    return { success: true };
  }),

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

  createEventDraft: privateProcedure
    .input(
      z.object({
        title: z.string(),
        wantReactions: z.array(z.string()),
      }),
    )
    .output(
      z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        authorId: z.string(),
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      return db.eventDraft.create({
        data: {
          id: generateUUID(),
          authorId: userId,
          title: input.title,
          content: "",
        },
        // TODO: add wantReactions
      });
    }),
});

export type AppRouter = typeof appRouter;
