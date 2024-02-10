import { Resend } from "resend";
import { ReactElement } from "react";

export const sendMail = async (
  to: string,
  subject: string,
  body: ReactElement,
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log("Sending email to", to, "with subject", subject);
  await resend.emails.send({
    from: "support@test-maker.app", // TODO: fix
    to,
    subject: `${subject} | イベントメル[EventMell]`,
    react: body,
  });
};
