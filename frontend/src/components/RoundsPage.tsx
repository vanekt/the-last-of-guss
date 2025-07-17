import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Clock, Play, CheckCircle, User, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import type { RoundWithStatus } from "@shared/types";
import Admin from "@/components/Admin";
import { roundsAPI } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const RoundsPage: React.FC = () => {
  const [rounds, setRounds] = useState<RoundWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchRounds = async () => {
    try {
      const data = await roundsAPI.getRounds();
      setRounds(data.items);
    } catch (error) {
      toast.error("Ошибка загрузки раундов");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
    const interval = setInterval(fetchRounds, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateRound = async () => {
    setCreating(true);
    try {
      const newRound = await roundsAPI.createRound();
      setRounds((prev) => [newRound, ...prev]);
      toast.success("Раунд создан!");
      navigate(`/rounds/${newRound.id}`);
    } catch (error) {
      toast.error("Ошибка создания раунда");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusInfo = (round: RoundWithStatus) => {
    const status = round.status?.status;
    switch (status) {
      case "active":
        return {
          text: "Активен",
          color: "text-green-400",
          bgColor: "bg-green-500/20",
          icon: Play,
        };
      case "pending":
        return {
          text: "Cooldown",
          color: "text-yellow-400",
          bgColor: "bg-yellow-500/20",
          icon: Clock,
        };
      case "finished":
        return {
          text: "Завершен",
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          icon: CheckCircle,
        };
      default:
        return {
          text: "Неизвестно",
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          icon: Clock,
        };
    }
  };

  const formatTimeRemaining = (timeRemaining?: number) => {
    if (!timeRemaining) return "";
    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Список раундов
            </h1>
            <p className="text-gray-300">Выберите раунд для участия</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white">
              <User className="w-5 h-5" />
              <span className="font-medium">{user?.username}</span>
              <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                {user?.role}
              </span>
            </div>
            <button
              onClick={() => navigate("/logout")}
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Выйти"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <Admin>
          <div className="mb-6">
            <button
              onClick={handleCreateRound}
              disabled={creating}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>{creating ? "Создание..." : "Создать раунд"}</span>
            </button>
          </div>
        </Admin>

        <div className="space-y-4">
          {rounds.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">Раундов пока нет</div>

              <Admin>
                <p className="text-gray-500 mt-2">Создайте первый раунд</p>
              </Admin>
            </div>
          ) : (
            rounds.map((round) => {
              const statusInfo = getStatusInfo(round);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={round.id}
                  onClick={() => navigate(`/rounds/${round.id}`)}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400/50 cursor-pointer transition-all transform hover:shadow-2xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <h3 className="text-white font-mono text-sm">
                          Round ID: {round.id}
                        </h3>
                      </div>

                      <div className="space-y-2 text-gray-300 text-sm">
                        <div>
                          <span className="text-gray-400">Start:</span>{" "}
                          {formatDate(round.startTime)}
                        </div>
                        <div>
                          <span className="text-gray-400">End:</span>{" "}
                          {formatDate(round.endTime)}
                        </div>
                      </div>

                      <div className="border-t border-white/10 my-4"></div>

                      <div className="flex items-center justify-between">
                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full ${statusInfo.bgColor}`}
                        >
                          <StatusIcon
                            className={`w-4 h-4 ${statusInfo.color}`}
                          />
                          <span
                            className={`text-sm font-medium ${statusInfo.color}`}
                          >
                            Статус: {statusInfo.text}
                          </span>
                        </div>

                        {round.status?.timeRemaining &&
                          round.status.status !== "finished" && (
                            <div className="text-purple-400 font-mono text-sm">
                              {round.status.status === "pending"
                                ? "До начала: "
                                : "Осталось: "}
                              {formatTimeRemaining(round.status.timeRemaining)}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RoundsPage;
