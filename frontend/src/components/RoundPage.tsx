import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, Trophy, Target, Clock } from "lucide-react";
import type { RoundStats, RoundWinner, RoundWithStatus } from "@shared/types";
import { useAuth } from "@/hooks/useAuth";
import { roundsAPI } from "@/services/api";

const RoundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: round,
    error,
    isLoading,
  } = useQuery<RoundWithStatus>({
    queryKey: [`round/${id}`],
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

  useEffect(() => {
    if (round?.status.status === "finished") {
      return;
    }

    const interval = setInterval(() => {
      queryClient.setQueryData([`round/${id}`], (old: RoundWithStatus) => {
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
  }, [round?.status.status]);

  const { data: stats } = useQuery<RoundStats>({
    queryKey: [`stats/${id}`],
    queryFn: () => roundsAPI.getStats(id!),
    enabled: !!id && !!user,
    initialData: { taps: 0, score: 0 },
    // refetchInterval: 5000,
  });

  const { data: winner } = useQuery<RoundWinner | null>({
    queryKey: [`winner/${id}`],
    queryFn: () => roundsAPI.getWinner(id!),
    enabled: round && round?.status.status === "finished",
  });

  const tapMutation = useMutation({
    mutationFn: () => {
      return roundsAPI.tap(id!);
    },
  });

  const handleTap = () => {
    if (!id || !round || round.status?.status !== "active") return;

    queryClient.setQueryData([`stats/${id}`], (old: RoundStats) => {
      if (!old) {
        return old;
      }

      const newTaps = old.taps + 1;

      return {
        taps: newTaps,
        score: old.score + (newTaps % 11 === 0 ? 10 : 1),
      };
    });

    tapMutation.mutate();
  };

  const formatTimeRemaining = (timeRemaining?: number) => {
    if (!timeRemaining) return "00:00";
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getStatusText = () => {
    if (!round?.status) return "";

    switch (round.status.status) {
      case "active":
        return "Раунд активен!";
      case "pending":
        return "Cooldown";
      case "finished":
        return "Раунд завершен";
      default:
        return "";
    }
  };

  const getStatusColor = () => {
    if (!round?.status) return "text-gray-400";

    switch (round.status.status) {
      case "active":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "finished":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (error || !round) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Не удалось загрузить раунд</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/rounds")}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Раунды</span>
          </button>

          <div className="flex items-center space-x-2 text-white">
            <User className="w-5 h-5" />
            <span className="font-medium">{user?.username}</span>
          </div>
        </div>

        {/* Game Area */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
            {/* Goose */}
            <div className="mb-8">
              <div
                className={`inline-block transition-transform duration-100 ${
                  round.status?.status === "active"
                    ? "active:scale-125 cursor-pointer"
                    : ""
                }`}
                onClick={handleTap}
              >
                <div className="text-8xl mb-4 select-none">🪿</div>
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <h2 className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
                {getStatusText()}
              </h2>

              {round.status?.timeRemaining &&
              round.status.status !== "finished" ? (
                <div className="flex items-center justify-center space-x-2 text-purple-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-mono">
                    {round.status.status === "pending"
                      ? "До начала раунда: "
                      : "До конца осталось: "}
                    {formatTimeRemaining(round.status.timeRemaining)}
                  </span>
                </div>
              ) : null}
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-blue-400 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="font-medium">Мои тапы</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.taps}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-purple-400 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">Мои очки</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.score}
                </div>
              </div>
            </div>

            {/* Round Stats (if finished) */}
            {round.status?.status === "finished" && (
              <div className="border-t border-white/20 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Статистика раунда
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400 mb-1">Всего тапов</div>
                    <div className="text-xl font-bold text-white">
                      {round.totalTaps}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400 mb-1">Всего очков</div>
                    <div className="text-xl font-bold text-white">
                      {round.totalScore}
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-gray-400 mb-1">Победитель</div>
                    <div className="text-lg font-bold text-yellow-400">
                      {winner ? `${winner.username} (${winner.score})` : "Нет"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Special message for Nikita */}
            {user?.role === "nikita" && round.status?.status === "active" && (
              <div className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">
                  ⚠️ Никита, твои тапы не засчитываются, но ты можешь тапать для
                  удовольствия!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundPage;
