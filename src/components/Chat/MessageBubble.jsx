export default function MessageBubble({ message, isOwn }) {
  console.log("Message:", message?.text?.substring(0, 30), "| isOwn =", isOwn); // Debug

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] px-4 py-3 rounded-2xl break-words shadow-sm
          ${isOwn 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-zinc-700 text-white rounded-bl-none'
          }`}
      >
        {message.image && (
          <img 
            src={message.image} 
            alt="attachment" 
            className="rounded-xl max-w-full mb-2" 
          />
        )}

        {message.text && (
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        )}

        <span className="text-xs opacity-75 mt-1.5 block text-right">
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}