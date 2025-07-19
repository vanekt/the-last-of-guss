import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx/lite";
import PurpleButton from "@/components/PurpleButton";
import { useAuth } from "@/hooks/useAuth";

const LoginPage: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);

    try {
      await login(username, password);
      toast.success("Добро пожаловать в игру!");

      navigate("/");
    } catch {
      toast.error("Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={clsx(
        "min-h-screen",
        "flex",
        "items-center",
        "justify-center",
        "p-4"
      )}
    >
      <div className={clsx("w-full", "max-w-md")}>
        <div
          className={clsx(
            "p-4",
            "space-y-4",
            "sm:bg-white/10",
            "sm:backdrop-blur-lg",
            "sm:rounded-2xl",
            "sm:shadow-2xl",
            "sm:border",
            "sm:border-white/20",
            "sm:p-8"
          )}
        >
          <div className={clsx("text-center")}>
            <h1 className={clsx("text-3xl", "font-bold", "text-white", "mb-2")}>
              The Last of Guss
            </h1>
            <p className={clsx("text-gray-300")}>Войдите, чтобы начать игру</p>
          </div>

          <form onSubmit={handleSubmit} className={clsx("space-y-6")}>
            <div>
              <label
                htmlFor="username"
                className={clsx(
                  "block",
                  "text-sm",
                  "font-medium",
                  "text-gray-200",
                  "mb-2"
                )}
              >
                Имя пользователя
              </label>
              <div className={clsx("relative")}>
                <User
                  className={clsx(
                    "absolute",
                    "left-3",
                    "top-1/2",
                    "transform",
                    "-translate-y-1/2",
                    "text-gray-400",
                    "w-5",
                    "h-5"
                  )}
                />

                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={clsx(
                    "w-full",
                    "pl-10",
                    "pr-4",
                    "py-3",
                    "bg-white/10",
                    "border",
                    "border-white/20",
                    "rounded-lg",
                    "text-white",
                    "placeholder-gray-400",
                    "focus:outline-none",
                    "focus:ring-2",
                    "focus:ring-purple-500",
                    "focus:border-transparent",
                    "transition-all"
                  )}
                  placeholder="Введите имя пользователя"
                  disabled={loading}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={clsx(
                  "block",
                  "text-sm",
                  "font-medium",
                  "text-gray-200",
                  "mb-2"
                )}
              >
                Пароль
              </label>
              <div className={clsx("relative")}>
                <Lock
                  className={clsx(
                    "absolute",
                    "left-3",
                    "top-1/2",
                    "transform",
                    "-translate-y-1/2",
                    "text-gray-400",
                    "w-5",
                    "h-5"
                  )}
                />

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={clsx(
                    "w-full",
                    "pl-10",
                    "pr-4",
                    "py-3",
                    "bg-white/10",
                    "border",
                    "border-white/20",
                    "rounded-lg",
                    "text-white",
                    "placeholder-gray-400",
                    "focus:outline-none",
                    "focus:ring-2",
                    "focus:ring-purple-500",
                    "focus:border-transparent",
                    "transition-all"
                  )}
                  placeholder="Введите пароль"
                  disabled={loading}
                />
              </div>
            </div>

            <PurpleButton
              type="submit"
              disabled={loading}
              title={loading ? "Вход..." : "Войти"}
            />
          </form>

          <div
            className={clsx("mt-6", "text-center", "text-sm", "text-gray-400")}
          >
            <p>Если аккаунта нет, он будет создан автоматически</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
