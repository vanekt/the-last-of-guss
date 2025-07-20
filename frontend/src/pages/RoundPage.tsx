import { useEffect, type FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trophy, Target, Clock } from "lucide-react";
import clsx from "clsx/lite";
import type {
  RoundStats,
  RoundWinner,
  RoundWithStatus,
  RoundStatusValue,
} from "@shared/types";
import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import Nikita from "@/components/Nikita";
import UserMenu from "@/components/UserMenu";
import { useAuth } from "@/hooks/useAuth";
import { getStatusInfo, formatTimeRemaining } from "@/utils/round";
import { roundsAPI } from "@/api";
import { useTapBatching } from "@/hooks/useTapBatching";

const Header: FC = () => {
  const navigate = useNavigate();

  return (
    <div className={clsx("flex", "justify-between", "items-center")}>
      <button
        onClick={() => navigate("/rounds")}
        className={clsx(
          "flex",
          "items-center",
          "space-x-2",
          "text-gray-400",
          "hover:text-white",
          "transition-colors",
          "cursor-pointer"
        )}
      >
        <ArrowLeft className={clsx("w-5", "h-5")} />
        <span>Раунды</span>
      </button>
      <UserMenu />
    </div>
  );
};

const GooseTapButton: FC<{ status: RoundStatusValue; onTap: () => void }> = ({
  status,
  onTap,
}) => (
  <div
    className={clsx(
      "inline-block",
      "transition-transform",
      "duration-100",
      status === "active" && "active:scale-125 cursor-pointer"
    )}
    onClick={onTap}
  >
    <div className={clsx("text-9xl", "select-none")}>🪿</div>
  </div>
);

const StatusTimer: FC<{ status: RoundStatusValue; timeRemaining?: number }> = ({
  status,
  timeRemaining,
}) => (
  <div className={clsx("align-middle", "space-y-2")}>
    <h2 className={clsx("text-2xl", "font-bold", getStatusInfo(status).color)}>
      {getStatusInfo(status).titleAlt}
    </h2>
    {timeRemaining && status !== "finished" ? (
      <div
        className={clsx(
          "flex",
          "items-center",
          "justify-center",
          "space-x-2",
          "text-purple-200"
        )}
      >
        <Clock className={clsx("w-5", "h-5")} />
        <span className={clsx("text-xl", "font-mono")}>
          {formatTimeRemaining(timeRemaining)}
        </span>
      </div>
    ) : null}
  </div>
);

const UserStats: FC<{ taps: number; score: number }> = ({ taps, score }) => (
  <div className={clsx("grid", "grid-cols-1", "sm:grid-cols-2", "gap-4")}>
    <div className={clsx("bg-white/5", "rounded-lg", "p-4")}>
      <div
        className={clsx(
          "flex",
          "items-center",
          "justify-center",
          "space-x-2",
          "text-blue-400"
        )}
      >
        <Target className={clsx("w-5", "h-5")} />
        <span className={clsx("font-medium")}>Мои тапы</span>
      </div>
      <div className={clsx("text-2xl", "font-bold", "text-white")}>{taps}</div>
    </div>
    <div className={clsx("bg-white/5", "rounded-lg", "p-4")}>
      <div
        className={clsx(
          "flex",
          "items-center",
          "justify-center",
          "space-x-2",
          "text-purple-400"
        )}
      >
        <Trophy className={clsx("w-5", "h-5")} />
        <span className={clsx("font-medium")}>Мои очки</span>
      </div>
      <div className={clsx("text-2xl", "font-bold", "text-white")}>{score}</div>
    </div>
  </div>
);

const RoundSummary: FC<{
  totalTaps: number;
  totalScore: number;
  winner?: RoundWinner | null;
}> = ({ totalTaps, totalScore, winner }) => (
  <div className={clsx("border-t", "border-white/10", "space-y-4", "pt-4")}>
    <h3 className={clsx("text-lg", "font-semibold", "text-white")}>
      Статистика раунда
    </h3>
    <div
      className={clsx(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-3",
        "gap-4",
        "text-sm"
      )}
    >
      <div className={clsx("bg-white/5", "rounded-lg", "p-3")}>
        <div className={clsx("text-gray-400")}>Всего тапов</div>
        <div className={clsx("text-xl", "font-bold", "text-white")}>
          {totalTaps}
        </div>
      </div>
      <div className={clsx("bg-white/5", "rounded-lg", "p-3")}>
        <div className={clsx("text-gray-400")}>Всего очков</div>
        <div className={clsx("text-xl", "font-bold", "text-white")}>
          {totalScore}
        </div>
      </div>
      <div className={clsx("bg-white/5", "rounded-lg", "p-3")}>
        <div className={clsx("text-gray-400")}>Победитель</div>
        <div className={clsx("text-lg", "font-bold", "text-yellow-400")}>
          {winner ? `${winner.username} (${winner.score})` : "Нет"}
        </div>
      </div>
    </div>
  </div>
);

const NikitaWarning: FC = () => (
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
      ⚠️ Никита, твои тапы не засчитываются, но ты можешь тапать для
      удовольствия!
    </p>
  </div>
);

const RoundPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: round,
    error,
    isLoading,
    isSuccess,
  } = useQuery<RoundWithStatus>({
    queryKey: ["round", id],
    queryFn: () => roundsAPI.getRound(id!),
    enabled: !!id && !!user,
    refetchInterval: ({ state }) => {
      const { data } = state;
      if (data?.status.status === "finished") {
        return false;
      }
      return data?.status.timeRemaining || 1000;
    },
  });

  const { data: stats } = useQuery<RoundStats>({
    queryKey: ["stats", id, round?.status.status],
    queryFn: () => roundsAPI.getStats(id!),
    enabled: isSuccess && ["active", "finished"].includes(round.status.status),
    initialData: { taps: 0, score: 0 },
  });

  const { data: winner } = useQuery<RoundWinner | null>({
    queryKey: ["winner", id],
    queryFn: () => roundsAPI.getWinner(id!),
    enabled: isSuccess && round.status.status === "finished",
  });

  useEffect(() => {
    if (!isSuccess || round.status.status === "finished") {
      return;
    }

    const interval = setInterval(() => {
      queryClient.setQueryData(["round", id], (old: RoundWithStatus) => {
        return {
          ...old,
          status: {
            ...old.status,
            timeRemaining: Math.max(0, old.status.timeRemaining - 1000),
          },
        };
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isSuccess, round?.status.status]);

  const { addTaps } = useTapBatching({
    roundId: id!,
    batchTimeout: 1000,
    maxBatchSize: 10,
  });

  const handleTap = () => {
    if (
      !isSuccess ||
      round.status.status !== "active" ||
      user?.role === "nikita"
    ) {
      return;
    }

    queryClient.setQueryData(
      ["stats", id, round.status.status],
      (old: RoundStats) => {
        const newTaps = old.taps + 1;
        return {
          taps: newTaps,
          score: old.score + (newTaps % 11 === 0 ? 10 : 1),
        };
      }
    );

    addTaps();
  };

  return (
    <div className={clsx("min-h-screen")}>
      <div
        className={clsx(
          "container",
          "mx-auto",
          "px-4",
          "py-4",
          "sm:py-8",
          "space-y-12"
        )}
      >
        <Header />

        <div className={clsx("max-w-2xl", "mx-auto")}>
          {isLoading && <LoadingState />}

          {error && <ErrorState />}

          {isSuccess && (
            <div
              className={clsx(
                "bg-white/10",
                "backdrop-blur-lg",
                "rounded-2xl",
                "p-8",
                "border",
                "border-white/20",
                "text-center",
                "space-y-4"
              )}
            >
              <GooseTapButton status={round.status.status} onTap={handleTap} />
              <StatusTimer
                status={round.status.status}
                timeRemaining={round.status.timeRemaining}
              />
              <UserStats taps={stats.taps} score={stats.score} />

              {round.status.status === "finished" && (
                <RoundSummary
                  totalTaps={round.totalTaps}
                  totalScore={round.totalScore}
                  winner={winner}
                />
              )}

              {round.status.status === "active" && (
                <Nikita>
                  <NikitaWarning />
                </Nikita>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundPage;
