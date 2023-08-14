import Status from "./Status";
import { IonButton } from "@ionic/react";

interface Props {
  status?: string;
}

const StatusSelector: React.FC<Props> = ({ status = "" }) => {
  return (
    <div className="flex items-center gap-1">
      <Status status={status} />
    </div>
  );
};

export default StatusSelector;
