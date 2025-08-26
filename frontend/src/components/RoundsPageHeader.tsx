import clsx from "clsx";
import UserMenu from "./UserMenu";

const RoundsPageHeader: React.FC = () => (
  <div
    className={clsx(
      "flex",
      "flex-col",
      "space-y-12",
      "justify-between",
      "items-end",
      "sm:flex-row-reverse"
    )}
  >
    <UserMenu />

    <div className={clsx("space-y-2", "self-start")}>
      <h1 className={clsx("text-4xl", "font-bold", "text-white")}>
        The Last of Guss
      </h1>
      <p className={clsx("text-gray-300")}>Выберите раунд для участия</p>
    </div>
  </div>
);

export default RoundsPageHeader;
