import clsx from "clsx";
import type { RoundStatusValue } from "@shared/types";
import { getStatusInfo } from "@/utils/getStatusInfo";
import { memo } from "react";

interface Props {
  status: RoundStatusValue;
}

const RoundStatus: React.FC<Props> = memo(({ status }) => (
  <h2 className={clsx("text-2xl", "font-bold", getStatusInfo(status).color)}>
    {getStatusInfo(status).titleAlt}
  </h2>
));

export default RoundStatus;
