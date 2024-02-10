import { privateProcedure } from "@/trpc/trpc";
import { db } from "@/db";

export const getMyEventDraftsPrivate = privateProcedure.query(
  async ({ ctx }) => {
    const { userId } = ctx;
    return db.eventDraft.findMany({
      where: {
        authorId: userId,
        createdAt: {
          // 投稿後2週間経ったら取得できなくなる
          gte: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 14),
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        wantReactions: {
          select: {
            reaction: true,
          },
        },
        arrivedReactions: {
          select: {
            reaction: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
    });
  },
);
