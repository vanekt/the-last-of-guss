import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Clock, Plus } from "lucide-react";
import clsx from "clsx/lite";
import type { RoundWithStatus } from "@shared/types";
import { formatDate, formatTime } from "@shared/frontend/helpers/rounds";
import Admin from "@/components/Admin";
import ErrorState from "@/components/ErrorState";
import GreenButton from "@/components/GreenButton";
import LoadingState from "@/components/LoadingState";
import PageContainer from "@/components/PageContainer";
import RoundsPageHeader from "@/components/RoundsPageHeader";
import { useRoundsQuery } from "@/queries/rounds";
import { useCreateRoundMutation } from "@/mutations/rounds";
import { getStatusInfo } from "@/utils/getStatusInfo";
import { useRoundTimer } from "@/hooks/useRoundTimer";

const RoundCard: React.FC<{
  round: RoundWithStatus;
  onClick: () => void;
  onTimeout: () => void;
}> = ({ round, onClick, onTimeout }) => {
  const status = round.status.value;
  const timeLeft = useRoundTimer({
    initTimeLeft: round.status.timer,
    disabled: status === "finished",
    onTimeout,
  });

  const statusInfo = getStatusInfo(round.status?.value);
  const StatusIcon = statusInfo.icon;

  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white/10",
        "backdrop-blur-lg",
        "rounded-xl",
        "p-6",
        "border",
        "border-white/20",
        "hover:border-purple-400/50",
        "cursor-pointer",
        "transition-all",
        "transform",
        "hover:shadow-2xl"
      )}
    >
      <div className={clsx("flex", "items-start", "justify-between")}>
        <div className={clsx("space-y-2", "max-w-full", "w-full")}>
          <div className={clsx("flex", "items-center", "space-x-3")}>
            <div
              className={clsx(
                "w-3",
                "h-3",
                "rounded-full",
                statusInfo.bgColorAlt,
                "shrink-0",
                "hidden",
                "sm:inline"
              )}
            ></div>
            <h3
              className={clsx(
                "text-white",
                "font-mono",
                "text-sm",
                "flex",
                "flex-col",
                "gap-0",
                "sm:flex-row",
                "sm:gap-2",
                "max-w-full"
              )}
            >
              <span>Round ID:</span>
              <span className={clsx("truncate")}>{round.id}</span>
            </h3>
          </div>
          <div className={clsx("space-y-1", "text-gray-300", "text-sm")}>
            <div>
              <span className={clsx("text-gray-400")}>Start:</span>{" "}
              {formatDate(round.startTime)}
            </div>
            <div>
              <span className={clsx("text-gray-400")}>End:</span>{" "}
              {formatDate(round.endTime)}
            </div>
          </div>
          <div className={clsx("border-t", "border-white/10", "my-4")}></div>
          <div className={clsx("flex", "items-center", "justify-between")}>
            <div
              className={clsx(
                "flex",
                "items-center",
                "space-x-2",
                "px-3",
                "py-1",
                "rounded-full",
                statusInfo.bgColor
              )}
            >
              <StatusIcon className={clsx("w-4", "h-4", statusInfo.color)} />
              <span
                className={clsx("text-sm", "font-medium", statusInfo.color)}
              >
                Статус: {statusInfo.title}
              </span>
            </div>

            {timeLeft && status !== "finished" ? (
              <div className={clsx("text-purple-400", "flex", "space-x-2")}>
                <Clock className={clsx("w-5", "h-5")} />
                <span className={clsx("font-mono", "text-sm")}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: React.FC = () => (
  <div className={clsx("text-center", "py-12")}>
    <div className={clsx("text-gray-400", "text-lg")}>Раундов пока нет</div>
    <Admin>
      <p className={clsx("text-gray-500", "mt-2")}>Создайте первый раунд</p>
    </Admin>
  </div>
);

const RoundsPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: rounds,
    error,
    isLoading,
    isSuccess,
    refetch,
  } = useRoundsQuery();

  const createMutation = useCreateRoundMutation(
    (data) => {
      toast.success("Раунд создан!");
      navigate(`/rounds/${data.id}`);
    },
    () => {
      toast.error("Ошибка создания раунда");
    }
  );

  return (
    <PageContainer>
      <RoundsPageHeader />

      <div className={clsx("space-y-6")}>
        <Admin>
          <GreenButton
            title={createMutation.isPending ? "Создание..." : "Создать раунд"}
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            icon={<Plus className={clsx("w-5", "h-5")} />}
          />
        </Admin>

        {isLoading && <LoadingState />}

        {error && <ErrorState />}

        {isSuccess && (
          <div className={clsx("space-y-6")}>
            {rounds.length === 0 ? (
              <EmptyState />
            ) : (
              rounds.map((round) => (
                <RoundCard
                  key={round.id}
                  round={round}
                  onClick={() => navigate(`/rounds/${round.id}`)}
                  onTimeout={refetch}
                />
              ))
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RoundsPage;
