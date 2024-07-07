import { CSSProperties } from "react";
import { IVisibilityStatus } from "$/types/IVisibilityStatus";

export const colorMapping: Record<IVisibilityStatus, CSSProperties["color"]> = {
  CENTERED_EXACTLY: "green",
  CENTERED: "limegreen",
  VISIBLE_FULLY: "yellow",
  VISIBLE_PARTLY: "orange",
  STILL_RENDERED: "darkorange",
  NOT_RENDERED: "red",
};
