const MessageStatus = ({ message }) => {
  if (message.read) {
    return <span style={{ color: "#4fc3f7" }}>✔✔</span>;
  }
  if (message.delivered) {
    return <span>✔✔</span>;
  }
  return <span>✔</span>;
};

export default MessageStatus;
