import { publicProcedure } from "@/trpc/trpc";
import { db } from "@/db";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const findOneEventDraftPublic = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const eventDraft = await db.eventDraft.findUnique({
      where: {
        id: input.id,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
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
    });

    if (!eventDraft) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "EventDraft not found",
      });
    }

    const reactionCounts = await db.eventDraftArrivedReaction.groupBy({
      by: ["reaction"],
      where: {
        eventDraftId: eventDraft.id,
      },
      _count: {
        reaction: true,
      },
    });

    const reactionCountsMap: Record<string, number> = {};
    reactionCounts.forEach((rc) => {
      reactionCountsMap[rc.reaction] = rc._count.reaction;
    });

    return {
      ...eventDraft,
      arrivedReactions: reactionCountsMap,
    };
  });
