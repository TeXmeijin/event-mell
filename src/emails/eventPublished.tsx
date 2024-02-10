type Props = {
  title: string;
  connpassUrl: string;
};

export const eventPublished = (input: Props) => {
  return (
    <span>
      {`新しいイベント ${input.title} が作成されました。詳細はこちら: ${input.connpassUrl}`}
    </span>
  );
};
