import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx/lite";
import { useAtomValue } from "jotai";
import type { RoundStats, RoundWithStatus } from "@shared/types";
import { isNikita, isSuperTap } from "@shared/helpers";
import { SUPER_TAP_SCORE } from "@shared/constants";
import ErrorState from "@/components/ErrorState";
import GooseTapButton from "@/components/GooseTapButton";
import LoadingState from "@/components/LoadingState";
import IfNikita from "@/components/IfNikita";
import NikitaWarning from "@/components/NikitaWarning";
import PageContainer from "@/components/PageContainer";
import RoundPageHeader from "@/components/RoundPageHeader";
import RoundStatus from "@/components/RoundStatus";
import RoundSummary from "@/components/RoundSummary";
import RoundTimer from "@/components/RoundTimer";
import UserStats from "@/components/UserStats";
import {
  useRoundQuery,
  useRoundStatsQuery,
  useRoundWinnerQuery,
} from "@/queries/rounds";
import { userRoleAtom } from "@/store/authAtoms";
import { useInterval } from "@/hooks/useInterval";
import { useHandleTap } from "@/hooks/useHandleTap";

const RoundPage: React.FC = () => {
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
    <PageContainer>
      <RoundPageHeader />

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
              <IfNikita>
                <NikitaWarning />
              </IfNikita>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RoundPage;
