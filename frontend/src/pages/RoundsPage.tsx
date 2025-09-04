import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import clsx from "clsx/lite";
import IfAdmin from "@/components/IfAdmin";
import ErrorState from "@/components/ErrorState";
import GreenButton from "@/components/GreenButton";
import LoadingState from "@/components/LoadingState";
import PageContainer from "@/components/PageContainer";
import RoundCard from "@/components/RoundCard";
import RoundsPageHeader from "@/components/RoundsPageHeader";
import { useRoundsQuery } from "@/queries/rounds";
import { useCreateRoundMutation } from "@/mutations/rounds";

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
        <IfAdmin>
          <GreenButton
            title={createMutation.isPending ? "Создание..." : "Создать раунд"}
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            icon={<Plus className={clsx("w-5", "h-5")} />}
          />
        </IfAdmin>

        {isLoading && <LoadingState />}

        {error && <ErrorState />}

        {isSuccess && (
          <div className={clsx("space-y-6")}>
            {rounds.length === 0 ? (
              <div className={clsx("text-center", "py-12")}>
                <div className={clsx("text-gray-400", "text-lg")}>
                  Раундов пока нет
                </div>
                <IfAdmin>
                  <p className={clsx("text-gray-500", "mt-2")}>
                    Создайте первый раунд
                  </p>
                </IfAdmin>
              </div>
            ) : (
              <>
                <p className="font-bold text-gray-300">
                  Выберите раунд для участия:
                </p>
                {rounds.map((round) => (
                  <RoundCard
                    key={round.id}
                    round={round}
                    onClick={() => navigate(`/rounds/${round.id}`)}
                    onTimeout={refetch}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default RoundsPage;
