import ResourcePanel from "../resource/ResourcePanel";
import ChatPanel from "../chat/ChatPanel";
import GreenSurface from "../primitives/GreenSurface";

export default function DiscoveryAgentLayout({
  messages,
  resources,
  onSend,
  onResourceSelect,
  isSearching,
  routingState,
  routingSummary,
}) {
  return (
    <GreenSurface>
      <div className="flex flex-col md:flex-row gap-6">
        <ChatPanel
          messages={messages}
          onSend={onSend}
          isSearching={isSearching}
        />
        <ResourcePanel
          resources={resources}
          onResourceSelect={onResourceSelect}
          routingState={routingState}
          routingSummary={routingSummary}
        />
      </div>
    </GreenSurface>
  );
}
