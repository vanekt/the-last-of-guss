import clsx from "clsx";

interface Props {
  children: React.ReactNode;
}

const PageContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className={clsx("min-h-screen")}>
      <div
        className={clsx(
          "container",
          "mx-auto",
          "px-4",
          "py-4",
          "sm:p-8",
          "space-y-12"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
