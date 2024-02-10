"use client";
import { Textarea } from "@/components/ui/textarea";
import { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldApi, useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { cn } from "@/lib/utils";

type Props = {};

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <span className={"text-xs text-orange-500"}>
      {field.state.meta.touchedErrors ? (
        <em>{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </span>
  );
}

export const Form = (props: Props) => {
  const client = trpc.createEventDraft.useMutation();
  const { Field, handleSubmit, Provider, state } = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      title: "",
      background: "",
      hostOrganizationName: "",
      wantReactions: ["offline"] as (
        | "offline"
        | "online"
        | "owner"
        | "rental"
      )[],
    },
    onSubmit: async (props) => {
      client.mutate(props.value);
    },
  });

  return (
    <Provider>
      <label className={"text-base text-subText"} htmlFor="title">
        どんなイベント？
      </label>
      <div className="mt-1 flex flex-col gap-y-2">
        <Field
          name={"title"}
          validators={{
            onBlur: z.string().min(10, "10文字以上入力してください").max(300),
          }}
        >
          {(field) => {
            // Avoid hasty abstractions. Render props are great!
            return (
              <>
                <Textarea
                  placeholder={
                    "DDDって実際どんなふうに実装するの？って気になっている方が参加する、DDDのコードベース見せあいっこイベント"
                  }
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field}></FieldInfo>
              </>
            );
          }}
        </Field>
      </div>
      <div className="mt-4">
        <Field
          name={"background"}
          validators={{
            onBlur: z.string().min(10, "10文字以上入力してください").max(300),
          }}
        >
          {(field) => {
            return (
              <>
                <label
                  className={"text-base text-subText"}
                  htmlFor="background"
                >
                  なんでこのイベントをやりたいの？
                </label>
                <Textarea
                  placeholder={
                    "DDDについてのSNS上での議論を見るのに疲れました。実際にやっている人、強くやりたいと思っている人だけ集めて密度の高いイベントをやりたい"
                  }
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </>
            );
          }}
        </Field>
      </div>
      <div className="mt-4">
        <Field name={"wantReactions"}>
          {(field) => {
            return (
              <>
                <label className={"text-base text-subText"} htmlFor="reaction">
                  みんなから欲しいリアクション
                </label>
                <div className="flex flex-col mt-2 gap-y-2">
                  <CheckboxFormItem
                    id={"offline"}
                    label={"オフラインで参加したい！"}
                    checked={field.state.value.includes("offline")}
                    onChange={(state) => {
                      field.handleChange(
                        state
                          ? [...field.state.value, "offline"]
                          : field.state.value.filter((v) => v !== "offline"),
                      );
                    }}
                  />
                  <CheckboxFormItem
                    id={"online"}
                    label={"オンラインで参加したい！"}
                    checked={field.state.value.includes("online")}
                    onChange={(state) => {
                      field.handleChange(
                        state
                          ? [...field.state.value, "online"]
                          : field.state.value.filter((v) => v !== "online"),
                      );
                    }}
                  />
                  <CheckboxFormItem
                    id={"owner"}
                    label={"一緒に企画運営したい！"}
                    checked={field.state.value.includes("owner")}
                    onChange={(state) => {
                      field.handleChange(
                        state
                          ? [...field.state.value, "owner"]
                          : field.state.value.filter((v) => v !== "owner"),
                      );
                    }}
                  />
                  <CheckboxFormItem
                    id={"rental"}
                    label={"会場貸します！"}
                    checked={field.state.value.includes("rental")}
                    onChange={(state) => {
                      field.handleChange(
                        state
                          ? [...field.state.value, "rental"]
                          : field.state.value.filter((v) => v !== "rental"),
                      );
                    }}
                  />
                </div>
              </>
            );
          }}
        </Field>
      </div>
      <div className="mt-4">
        <Button
          onClick={handleSubmit}
          disabled={state.isSubmitting || !state.isValid}
          className={
            "bg-primary w-full hover:bg-primary/60 disabled:bg-disabled"
          }
        >
          起案する
        </Button>
      </div>
    </Provider>
  );
};

const CheckboxFormItem: FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: (state: boolean) => void;
}> = ({ id, label, checked, onChange }) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-x-1 p-4 rounded-lg text-sm cursor-pointer font-medium leading-none",
        checked && "bg-primary_background",
        !checked && "bg-gray_background",
      )}
    >
      <Checkbox onCheckedChange={onChange} checked={checked} id={id} />
      {label}
    </label>
  );
};
