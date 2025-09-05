import { reactify } from "@vueuse/core";
import { getStatusInfo } from "@/utils/getStatusInfo";

export const useStatusInfo = reactify(getStatusInfo);
