export default function HeaderSticker({ children }) {
  return (
    <div className="
      relative bg-ib-linen dark:bg-[#3A3A3A]
      text-text-primaryLight dark:text-text-primaryDark
      p-4 rounded-md border-l-4 border-ib-green font-bold tracking-wide
    ">
      <div className="absolute w-6 h-6 bottom-0 right-0 bg-ib-border dark:bg-[#555]
                      shadow-md rotate-3 rounded-br-md"></div>
      {children}
    </div>
  );
}
