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
    <div className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white shadow-[0_8px_40px_rgba(26,26,26,0.06)]">
      <div className="grid min-h-[520px] lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)]">
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
