import { Toaster as ReactHotToaster } from "react-hot-toast";

export const Toaster = () => (
  <ReactHotToaster
    position="top-center"
    toastOptions={{
      duration: 3000,
      style: {
        background: "rgba(0, 0, 0, 0.25)",
        color: "#ffffff",
        backdropFilter: "blur(20px)",
      },
    }}
  />
);
