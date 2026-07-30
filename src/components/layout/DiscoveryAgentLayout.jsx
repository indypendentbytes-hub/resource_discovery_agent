import ResourcePanel from "../resource/ResourcePanel";
import ChatPanel from "../chat/ChatPanel";
import GreenSurface from "../primitives/GreenSurface";

export default function DiscoveryAgentLayout({ messages, resources }) {
  return (
    <GreenSurface>
      <div className="flex flex-col md:flex-row gap-6">
        <ChatPanel messages={messages} />
        <ResourcePanel resources={resources} />
      </div>
    </GreenSurface>
  );
}
