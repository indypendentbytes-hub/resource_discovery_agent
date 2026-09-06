import ChatPanel from "../chat/ChatPanel";

const PATH_LABELS = {
  growers: {
    label: "Cultivator capacity",
    kind: "Actor",
    detail: "A producer or production capability is part of this path.",
  },
  landHosts: {
    label: "Land access",
    kind: "Dependency",
    detail: "Land, site access, or a host relationship must be resolved.",
  },
  training: {
    label: "Training & readiness",
    kind: "Capability",
    detail: "A skill, credential, or preparation step may be required.",
  },
  logistics: {
    label: "Transportation & logistics",
    kind: "Dependency",
    detail: "Movement, delivery, or transportation constraints affect the path.",
  },
  funding: {
    label: "Capital",
    kind: "Dependency",
    detail: "Funding or another source of capital may be required.",
  },
  buyers: {
    label: "Buyer or market",
    kind: "Actor",
    detail: "A buyer, customer, or market actor is part of the path.",
  },
  compliance: {
    label: "Approval & compliance",
    kind: "Dependency",
    detail: "An approval, permit, or compliance requirement must be resolved.",
  },
};

function toPathNodes(resources = []) {
  const seen = new Set();

  return resources.reduce((nodes, resource) => {
    const category = resource?.category || "resource";
    if (seen.has(category)) return nodes;
    seen.add(category);

    const fallbackLabel = category
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (letter) => letter.toUpperCase());
    const descriptor = PATH_LABELS[category] || {
      label: fallbackLabel,
      kind: "Path element",
      detail: "RDA is evaluating what role this requirement plays in the path.",
    };

    nodes.push({
      id: category,
      ...descriptor,
    });

    return nodes;
  }, []);
}

export default function DiscoveryAgentLayout({
  messages,
  resources,
  onSend,
  isSearching,
}) {
  const pathNodes = toPathNodes(resources);

  return (
    <div className="agent-path-shell">
      <div className="agent-path-canvas">
        <div className="agent-path-nodes" aria-live="polite">
          {pathNodes.map((node, index) => (
            <article
              key={node.id}
              className={`agent-path-node path-slot-${(index % 6) + 1}`}
            >
              <div className="agent-path-node-meta">
                <span>{node.kind}</span>
                <span className={isSearching ? "is-evaluating" : ""}>
                  {isSearching ? "Evaluating" : "Identified"}
                </span>
              </div>
              <h4>{node.label}</h4>
              <p>{node.detail}</p>
            </article>
          ))}
        </div>

        <div className="agent-conversation-core">
          <ChatPanel
            messages={messages}
            onSend={onSend}
            isSearching={isSearching}
          />
        </div>

        {pathNodes.length === 0 && (
          <p className="agent-path-empty">
            The path will assemble here as RDA identifies actors, capabilities,
            and dependencies.
          </p>
        )}
      </div>
    </div>
  );
}
