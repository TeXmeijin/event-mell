import { privateProcedure } from "@/trpc/trpc";
import { z } from "zod";
import { db, generateUUID } from "@/db";

export const createEventDraftPrivate = privateProcedure
  .input(
    z.object({
      title: z.string(),
      background: z.string(),
      wantReactions: z.array(z.string()),
      hostOrganizationName: z.string(),
    }),
  )
  .output(
    z.object({
      id: z.string(),
      title: z.string(),
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
        background: input.background,
        hostOrganizationName: input.hostOrganizationName,
        wantReactions: {
          create: input.wantReactions.map((reaction) => ({
            reaction,
          })),
        },
      },
    });
  });
