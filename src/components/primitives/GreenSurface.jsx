export default function GreenSurface({ children }) {
  return (
    <div className="
      relative bg-greenSoil text-text-onGreenLight dark:text-text-onGreenDark p-6 rounded-xl
    ">
      <div className="absolute inset-0 bg-soil opacity-15 mix-blend-multiply pointer-events-none"></div>
      {children}
    </div>
  );
}
