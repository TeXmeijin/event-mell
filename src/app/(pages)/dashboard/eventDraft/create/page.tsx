import { FC, PropsWithChildren } from "react";
import { Form } from "./_form";

export default async function page() {
  return (
    <div className={"flex flex-col h-screen p-12 bg-white"}>
      <PageContent>
        <h1 className={"text-xl"}>イベントを起案する</h1>
        <div className="mt-4">
          <Form></Form>
        </div>
      </PageContent>
    </div>
  );
}

const PageContent: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className={"w-full flex-1 flex flex-col max-w-[600px] mx-auto"}>
      {children}
    </main>
  );
};
