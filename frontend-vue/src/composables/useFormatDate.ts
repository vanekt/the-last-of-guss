import { reactify } from "@vueuse/core";
import { formatDate } from "@shared/frontend/helpers/rounds";

export const useFormatDate = reactify(formatDate);
