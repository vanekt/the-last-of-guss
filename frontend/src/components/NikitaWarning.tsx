import clsx from "clsx";

const NikitaWarning: React.FC = () => (
  <div
    className={clsx(
      "p-4",
      "bg-red-500/20",
      "border",
      "border-red-500/30",
      "rounded-lg"
    )}
  >
    <p className={clsx("text-red-400", "text-sm")}>
      Никита, твои тапы не засчитываются!
    </p>
  </div>
);

export default NikitaWarning;
