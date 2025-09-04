import clsx from "clsx";
import UserMenu from "./UserMenu";

const RoundsPageHeader: React.FC = () => (
  <div
    className={clsx(
      "flex",
      "flex-col",
      "gap-12",
      "justify-between",
      "items-end",
      "sm:flex-row-reverse",
      "sm:items-start"
    )}
  >
    <UserMenu />

    <div className="space-y-2 self-start">
      <h1 className="text-4xl font-bold text-white">The Last of Guss</h1>
    </div>
  </div>
);

export default RoundsPageHeader;
