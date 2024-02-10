import { privateProcedure } from "@/trpc/trpc";
import { z } from "zod";
import { db } from "@/db";

export const updateUserPrivate = privateProcedure
  .input(
    z.object({
      id: z.string(),
      username: z.string().optional(),
    }),
  )
  .output(
    z.object({
      id: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    if (userId !== input.id) {
      throw new Error("Unauthorized");
    }
    return await db.user.update({
      where: { id: input.id },
      data: {
        username: input.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullname: true,
        image: true,
      },
    });
  });
