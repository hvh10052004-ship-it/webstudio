export function ChatQuote({
  name,
  body,
  image,
  onClick,
}: {
  name: string;
  body: string;
  image?: string;
  onClick?: () => void;
}) {
  const preview = body.trim() || (image ? "Ảnh" : "");
  const inner = (
    <>
      <strong>{name}</strong>
      <span>{preview}</span>
    </>
  );
  if (onClick) {
    return (
      <button type="button" className="chat-quote" onClick={onClick}>
        {inner}
      </button>
    );
  }
  return <div className="chat-quote">{inner}</div>;
}
