"use client";

import { trpc } from "@/app/_trpc/client";
import { Skeleton } from "@/components/ui/skeleton";

export const EventDraftList = async () => {
  const { data, isLoading } = trpc.getMyEventDrafts.useQuery();

  if (isLoading || !data) {
    return <Skeleton />;
  }

  return (
    <ul className={"flex items-stretch flex-col w-full"}>
      {data.map((event) => (
        <div className={"border-b border-border py-4"} id={event.id}>
          <p>{event.title}</p>
          <p className={"text-xs text-right"}>{event.createdAt}</p>
        </div>
      ))}
      {data.length === 0 && (
        <p>
          起案中のイベントがありません。「イベントを起案する」からイベント案を作りましょう
        </p>
      )}
    </ul>
  );
};
