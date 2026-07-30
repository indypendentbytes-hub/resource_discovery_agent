import DiscoveryAgentLayout from "./components/layout/DiscoveryAgentLayout";

const messages = [
  { sender: "assistant", text: "Welcome to Resource Discovery." },
  { sender: "user", text: "Show me growers near Haughville." },
];

const resources = [
  { title: "Grower: Example Farm", details: "2 acres • mixed veg • organic-leaning" },
  { title: "Land Host: Example Lot", details: "0.5 acre • water access • zoning OK" },
];

export default function App() {
  return <DiscoveryAgentLayout messages={messages} resources={resources} />;
}
