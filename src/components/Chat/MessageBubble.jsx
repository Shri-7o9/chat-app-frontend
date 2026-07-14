export default function MessageBubble({ message, isOwn }) {
  return (
    <div style={{ textAlign: isOwn ? "right" : "left" }}>
      {message.image && <img src={message.image} alt="attachment" width={150} />}
      {message.text && <p>{message.text}</p>}
      <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
    </div>
  );
}