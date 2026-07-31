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
    <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_24px_70px_rgba(20,35,25,0.12)] dark:border-white/10 dark:bg-[#181818]">
      <div className="grid min-h-[520px] lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
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
