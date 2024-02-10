import { privateProcedure } from "@/trpc/trpc";
import { z } from "zod";
import { db, generateUUID } from "@/db";
import { sendMail } from "@/lib/mail";
import { arrivedReaction } from "@/emails/arrivedReaction";

export const addReactionToEventDraftPrivate = privateProcedure
  .input(
    z.object({
      eventDraftId: z.string(),
      comment: z.string().optional(),
      reaction: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { userId, user: reactionUser } = ctx;
    await db.eventDraftArrivedReaction.create({
      data: {
        eventDraftId: input.eventDraftId,
        comment: input.comment,
        authorId: userId,
        reaction: input.reaction,
      },
    });

    const eventDraftResponse = await db.eventDraft.findUnique({
      where: {
        id: input.eventDraftId,
      },
      select: {
        title: true,
        author: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });

    if (!eventDraftResponse) {
      throw new Error("User or event draft not found");
    }

    await db.notification.create({
      data: {
        id: generateUUID(),
        type: "ARRIVED_REACTION",
        payload: JSON.stringify({
          eventDraftId: input.eventDraftId,
          reactionUserName: reactionUser.username,
        }),
        userId: userId,
      },
    });

    await sendMail(
      eventDraftResponse.author.email,
      "イベント案にリアクションがありました！",
      arrivedReaction({
        username: eventDraftResponse.author.username ?? "",
        eventTitle: eventDraftResponse.title,
        eventId: input.eventDraftId,
      }),
    );
  });
