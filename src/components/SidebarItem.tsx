type Props = {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
};

export default function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition ${
        active
          ? "bg-[#f0f0f0] text-black font-medium"
          : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}