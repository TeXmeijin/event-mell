type Props = {
  username: string;
  eventId: string;
  eventTitle: string;
};

export const arrivedReaction = ({ username, eventId, eventTitle }: Props) => {
  return (
    <div>
      <p>{username}さん</p>
      <p>{eventTitle}のイベントにリアクションがありました！</p>
      <p>このメールは、イベントに参加した際に自動で送信されています。</p>
      <p>イベントの詳細はこちらから確認できます。</p>
      <p>
        <a href={`https://www.eventmell.dev/eventDrafts/${eventId}`}>
          イベント詳細
        </a>
      </p>
    </div>
  );
};
