import ResourcePanel from "../resource/ResourcePanel";
import ChatPanel from "../chat/ChatPanel";

export default function DiscoveryAgentLayout({
  messages,
  resources,
  onSend,
  onResourceSelect,
  isSearching,
}) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_50px_rgba(20,35,25,0.10)]">
      <div className="grid min-h-[500px] lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.8fr)]">
        <ChatPanel
          messages={messages}
          onSend={onSend}
          isSearching={isSearching}
        />
        <ResourcePanel
          resources={resources}
          onResourceSelect={onResourceSelect}
        />
      </div>
    </div>
  );
}
