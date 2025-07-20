import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Plus } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx/lite";
import type { RoundWithStatus } from "@shared/types";
import Admin from "@/components/Admin";
import ErrorState from "@/components/ErrorState";
import GreenButton from "@/components/GreenButton";
import LoadingState from "@/components/LoadingState";
import UserMenu from "@/components/UserMenu";
import { roundsAPI } from "@/api";
import { formatDate, getStatusInfo, formatTimeRemaining } from "@/utils/round";

const RoundCard: FC<{
  round: RoundWithStatus;
  onClick: () => void;
  onTimeout: () => void;
}> = ({ round, onClick, onTimeout }) => {
  const status = round.status.status;
  const initTimeRemaining = round.status.timeRemaining;
  const [timeRemaining, setTimeRemaining] = useState(
    round.status.timeRemaining
  );

  useEffect(() => {
    setTimeRemaining(initTimeRemaining);
  }, [initTimeRemaining]);

  useEffect(() => {
    if (status === "finished") {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newVal = prev - 1000;
        if (newVal < 0) {
          onTimeout();
          return 0;
        }
        return newVal;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const statusInfo = getStatusInfo(round.status?.status);
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
            {timeRemaining && status !== "finished" ? (
              <div className={clsx("text-purple-400", "flex", "space-x-2")}>
                <Clock className={clsx("w-5", "h-5")} />
                <span className={clsx("font-mono", "text-sm")}>
                  {formatTimeRemaining(timeRemaining)}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: FC = () => (
  <div className={clsx("text-center", "py-12")}>
    <div className={clsx("text-gray-400", "text-lg")}>Раундов пока нет</div>
    <Admin>
      <p className={clsx("text-gray-500", "mt-2")}>Создайте первый раунд</p>
    </Admin>
  </div>
);

const Header: FC = () => (
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

const RoundsPage: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: rounds,
    error,
    isLoading,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ["rounds"],
    queryFn: roundsAPI.getRounds,
    select: (data) => data.items,
    refetchInterval: 10000,
  });

  const createMutation = useMutation({
    mutationFn: roundsAPI.createRound,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Раунд создан!");
      navigate(`/rounds/${data.id}`);
    },
    onError: () => {
      toast.error("Ошибка создания раунда");
    },
  });

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
        <Header />

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
      </div>
    </div>
  );
};

export default RoundsPage;
