export default function SoilPanel({ children }) {
  return (
    <div className="
      relative bg-ib-cream text-text-onCreamLight dark:text-text-onCreamDark
      rounded-xl p-5
    ">
      <div className="absolute inset-0 bg-soil opacity-15 mix-blend-multiply pointer-events-none"></div>
      {children}
    </div>
  );
}
