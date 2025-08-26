import { type FC, type MouseEvent, memo, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Trophy, Target, Clock } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import clsx from "clsx/lite";
import { useAtomValue } from "jotai";
import type {
  RoundStats,
  RoundWinner,
  RoundWithStatus,
  RoundStatusValue,
} from "@shared/types";
import { isNikita, isSuperTap } from "@shared/helpers";
import { SUPER_TAP_SCORE } from "@shared/constants";
import { formatTime } from "@shared/frontend/helpers/rounds";
import ErrorState from "@/components/ErrorState";
import { type Floatable, FloatableText } from "@/components/FloatableText";
import LoadingState from "@/components/LoadingState";
import Nikita from "@/components/Nikita";
import UserMenu from "@/components/UserMenu";
import {
  useRoundQuery,
  useRoundStatsQuery,
  useRoundWinnerQuery,
} from "@/queries/rounds";
import { userRoleAtom } from "@/store/authAtoms";
import { useInterval } from "@/hooks/useInterval";
import { useHandleTap } from "@/hooks/useHandleTap";
import { getStatusInfo } from "@/utils/getStatusInfo";

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

interface GooseTapButtonProps {
  accent: boolean;
  floatableLabel: string;
  disabled: boolean;
  onTap: () => void;
}

const GooseTapButton: FC<GooseTapButtonProps> = memo(
  ({ accent, floatableLabel, disabled, onTap }) => {
    const [isScaling, setIsScaling] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);
    const [floatables, setFloatables] = useState<Floatable[]>([]);

    const handleClick = (e: MouseEvent<HTMLElement>) => {
      if (disabled) {
        return;
      }

      setIsScaling(true);
      setTimeout(() => setIsScaling(false), 100);

      if (accent) {
        setIsSpinning(true);
        setTimeout(() => setIsSpinning(false), 700);
      }

      onTap();

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setFloatables((prev) => [
        ...prev,
        {
          key: Date.now() + Math.random(),
          x,
          y,
          label: floatableLabel,
          accent,
        },
      ]);
    };

    const handleFloatComplete = (id: number) => {
      setFloatables((prev) => prev.filter((b) => b.key !== id));
    };

    return (
      <div className="relative inline-block select-none">
        <div
          className={clsx(
            "inline-flex transition-transform duration-100",
            isScaling && "scale-125",
            isSpinning && "spin-goose",
            disabled && "opacity-50",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
          onClick={handleClick}
        >
          <div className={clsx("text-9xl")}>🪿</div>
        </div>

        <AnimatePresence>
          {floatables.map((floatable) => (
            <FloatableText
              key={floatable.key}
              label={floatable.label}
              accent={floatable.accent}
              x={floatable.x}
              y={floatable.y}
              onComplete={() => handleFloatComplete(floatable.key)}
            />
          ))}
        </AnimatePresence>
      </div>
    );
  }
);

interface RoundStatusProps {
  status: RoundStatusValue;
}

const RoundStatus: FC<RoundStatusProps> = memo(({ status }) => (
  <h2 className={clsx("text-2xl", "font-bold", getStatusInfo(status).color)}>
    {getStatusInfo(status).titleAlt}
  </h2>
));

interface RoundTimerProps {
  value?: number;
}

const RoundTimer: FC<RoundTimerProps> = memo(({ value }) => (
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
    <span className={clsx("text-xl", "font-mono")}>{formatTime(value)}</span>
  </div>
));

interface UserStatsProps {
  taps: number;
  score: number;
}

const UserStats: FC<UserStatsProps> = memo(({ taps, score }) => (
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
));

interface RoundSummaryProps {
  totalTaps: number;
  totalScore: number;
  winner?: RoundWinner | null;
}

const RoundSummary: FC<RoundSummaryProps> = ({
  totalTaps,
  totalScore,
  winner,
}) => (
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
      Никита, твои тапы не засчитываются!
    </p>
  </div>
);

const RoundPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const role = useAtomValue(userRoleAtom);
  const queryClient = useQueryClient();

  const {
    data: round,
    error,
    isLoading,
    isSuccess: isRoundLoaded,
  } = useRoundQuery(id!);

  const { data: stats } = useRoundStatsQuery(
    id!,
    isRoundLoaded,
    round?.status.value
  );

  const { data: winner } = useRoundWinnerQuery(
    id!,
    isRoundLoaded,
    round?.status.value
  );

  const timerCallback = useCallback(() => {
    queryClient.setQueryData(["round", round?.id], (old: RoundWithStatus) => ({
      ...old,
      status: {
        ...old.status,
        timer: Math.max(0, old.status.timer - 1000),
      },
    }));
  }, [round?.id, queryClient]);

  useInterval({
    delay: 1000,
    disabled: !isRoundLoaded || round?.status.value === "finished",
    callback: timerCallback,
  });

  const shouldIgnoreTap = isNikita(role);
  const handleTapOptimistic = useCallback(() => {
    if (shouldIgnoreTap) {
      return;
    }

    queryClient.setQueryData(
      ["stats", round?.id, round?.status.value],
      (old: RoundStats) => {
        const newTaps = old.taps + 1;
        return {
          taps: newTaps,
          score: old.score + (isSuperTap(newTaps) ? SUPER_TAP_SCORE : 1),
        };
      }
    );
  }, [shouldIgnoreTap, round?.id, round?.status.value, queryClient]);

  const handleTap = useHandleTap({
    roundId: round?.id || "",
    disabled: !isRoundLoaded || !round || round?.status.value !== "active",
    callback: handleTapOptimistic,
  });

  const floatableLabel = shouldIgnoreTap
    ? "+0"
    : isSuperTap(stats.taps + 1)
      ? `+${SUPER_TAP_SCORE}`
      : "+1";

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

          {isRoundLoaded && (
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
              <GooseTapButton
                disabled={round.status.value !== "active"}
                onTap={handleTap}
                accent={isSuperTap(stats.taps + 1)}
                floatableLabel={floatableLabel}
              />

              <div className={clsx("align-middle", "space-y-2")}>
                <RoundStatus status={round.status.value} />

                {round.status.timer && round.status.value !== "finished" ? (
                  <RoundTimer value={round.status.timer} />
                ) : null}
              </div>

              <UserStats taps={stats.taps} score={stats.score} />

              {round.status.value === "finished" && (
                <RoundSummary
                  totalTaps={round.totalTaps}
                  totalScore={round.totalScore}
                  winner={winner}
                />
              )}

              {round.status.value === "active" && (
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
