import type { Component } from "vue";
import { Play, Clock, CheckCircle } from "lucide-vue-next";
import { getStatusInfo as getStatusInfoOrig } from "@shared/frontend/helpers/getStatusInfo";
import type {
  RoundStatusValue,
  RoundStatusInfo as RoundStatusInfoOrig,
} from "@shared/types";

interface RoundStatusInfo extends RoundStatusInfoOrig {
  icon: Component;
}

const icons = { active: Play, pending: Clock, finished: CheckCircle };

export function getStatusInfo(status: RoundStatusValue): RoundStatusInfo {
  const statusInfo = getStatusInfoOrig(status);
  return { ...statusInfo, icon: icons[status] };
}
