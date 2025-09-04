import { useTitle } from "@vueuse/core";

export function usePageTitle(initValue?: string) {
  const title = useTitle(initValue, { titleTemplate: "%s | The Last of Guss" });

  function setTitle(newValue: string) {
    console.log("setTitle", newValue);
    title.value = newValue;
  }

  return {
    title,
    setTitle,
  };
}
