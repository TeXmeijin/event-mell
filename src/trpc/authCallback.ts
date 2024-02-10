import { publicProcedure } from "@/trpc/trpc";
import { currentUser } from "@clerk/nextjs";
import { getUserEmail } from "@/lib/utils";
import { TRPCError } from "@trpc/server";
import { db } from "@/db";

export const authCallback = publicProcedure.query(async () => {
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
});
