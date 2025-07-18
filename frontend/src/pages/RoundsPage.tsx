import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import type { RoundWithStatus } from "@shared/types";
import Admin from "@/components/Admin";
import ErrorState from "@/components/ErrorState";
import GreenButton from "@/components/GreenButton";
import LoadingState from "@/components/LoadingState";
import UserMenu from "@/components/UserMenu";
import { roundsAPI } from "@/api";
import { formatDate, getStatusInfo, formatTimeRemaining } from "@/utils/round";

const RoundCard: FC<{ round: RoundWithStatus; onClick: () => void }> = ({
  round,
  onClick,
}) => {
  const statusInfo = getStatusInfo(round.status?.status);
  const StatusIcon = statusInfo.icon;
  return (
    <div
      onClick={onClick}
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
              <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
              <span className={`text-sm font-medium ${statusInfo.color}`}>
                Статус: {statusInfo.title}
              </span>
            </div>
            {round.status?.timeRemaining &&
            round.status.status !== "finished" ? (
              <div className="text-purple-400 font-mono text-sm">
                {round.status.status === "pending"
                  ? "До начала: "
                  : "Осталось: "}
                {formatTimeRemaining(round.status.timeRemaining)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState: FC = () => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-lg">Раундов пока нет</div>
    <Admin>
      <p className="text-gray-500 mt-2">Создайте первый раунд</p>
    </Admin>
  </div>
);

const Header: FC = () => (
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">Список раундов</h1>
      <p className="text-gray-300">Выберите раунд для участия</p>
    </div>
    <div className="flex items-center space-x-4">
      <UserMenu />
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <Admin>
          <div className="mb-6">
            <GreenButton
              title={createMutation.isPending ? "Создание..." : "Создать раунд"}
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              icon={<Plus className="w-5 h-5" />}
            />
          </div>
        </Admin>

        {isLoading && <LoadingState />}
        {error && <ErrorState />}
        {isSuccess && (
          <div className="space-y-4">
            {rounds.length === 0 ? (
              <EmptyState />
            ) : (
              rounds.map((round) => (
                <RoundCard
                  key={round.id}
                  round={round}
                  onClick={() => navigate(`/rounds/${round.id}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoundsPage;
