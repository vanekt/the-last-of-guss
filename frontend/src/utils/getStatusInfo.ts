import { Play, Clock, CheckCircle } from "lucide-react";
import { getStatusInfo as getStatusInfoOrig } from "@shared/helpers/getStatusInfo";
import type {
  RoundStatusValue,
  RoundStatusInfo as RoundStatusInfoOrig,
} from "@shared/types";

interface RoundStatusInfo extends RoundStatusInfoOrig {
  icon: React.ElementType;
}

const icons = { active: Play, pending: Clock, finished: CheckCircle };

export function getStatusInfo(status: RoundStatusValue): RoundStatusInfo {
  const statusInfo = getStatusInfoOrig(status);
  return { ...statusInfo, icon: icons[status] };
}
