import { privateProcedure } from "@/trpc/trpc";
import { z } from "zod";
import { db, generateUUID } from "@/db";
import { sendMail } from "@/lib/mail";
import { eventPublished } from "@/emails/eventPublished";

export const createConnpassPageCreatedEventPrivate = privateProcedure
  .input(
    z.object({
      title: z.string(),
      connpassUrl: z.string(),
      eventDraftId: z.string(),
      place: z.enum(["online", "offline", "hybrid"]),
    }),
  )
  .output(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const newEvent = await db.connpassPageCreatedEvent.create({
      data: {
        id: generateUUID(),
        title: input.title,
        connpassUrl: input.connpassUrl,
        eventDraftId: input.eventDraftId,
        place: input.place,
      },
      select: {
        id: true,
      },
    });

    const reactions = await db.eventDraftArrivedReaction.findMany({
      where: {
        eventDraftId: input.eventDraftId,
        reaction: {
          in:
            input.place === "online"
              ? ["online"]
              : input.place === "offline"
              ? ["offline"]
              : ["online", "offline"],
        },
      },
      include: {
        author: true,
      },
    });

    const sendMailPromises = reactions.map((reaction) =>
      sendMail(
        reaction.author.email,
        "あなたが参加したいリアクションをしていたイベントが公開されました",
        eventPublished({
          title: input.title,
          connpassUrl: input.connpassUrl,
        }),
      ),
    );

    await Promise.all(sendMailPromises);

    return newEvent;
  });
