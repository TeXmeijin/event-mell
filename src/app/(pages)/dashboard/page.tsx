import { currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventDraftList } from "@/app/(pages)/dashboard/_components/EventDraftList";

export async function generateMetadata() {
  const user = await currentUser();
  return {
    title: `${user?.firstName}'s`,
  };
}

export default async function page() {
  // const user = await currentUser();
  // if (!user || !user.id) redirect("/auth-callback?origin=/");
  //
  // const email = getUserEmail(user);
  //
  // const dbUser = await db.user.findUnique({
  //   where: {
  //     email: email,
  //   },
  // });
  //
  // if (!dbUser) redirect("/auth-callback?origin=/dashboard");
  //
  // revalidatePath("/auth-callback");
  return (
    <div className="p-8 w-full items-stretch flex gap-y-6 flex-col ">
      <h1 className="scroll-m-20 text-xl space-y-3 justify-center">
        ダッシュボード
      </h1>
      <div className={"flex justify-end"}>
        <Link href={"/dashboard/eventDraft/create"}>
          <Button className={"bg-primary"}>イベントを起案する</Button>
        </Link>
      </div>
      <div>
        <EventDraftList></EventDraftList>
      </div>
    </div>
  );
}
