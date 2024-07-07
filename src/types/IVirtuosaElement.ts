import { IVisibilityStatus } from "$/types/IVisibilityStatus";

export type IVirtuosaElement = ({
  index,
  isActive,
  visibilityStatus,
}: {
  index: number;
  isActive: boolean;
  visibilityStatus: IVisibilityStatus;
}) => JSX.Element;
