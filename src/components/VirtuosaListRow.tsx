import React from "react";
import { IVirtuosaElement } from "$/types/IVirtuosaElement";
import { IOnChangeTrigger } from "$/types/IOnChangeTrigger";
import { IVisibilityStatus } from "$/types/IVisibilityStatus";
import { colorMapping } from "$/colorMapping";

interface VirtuosaListRowProps {}

interface VirtuosaListRowProps {
  index: number;
  E: IVirtuosaElement;
  onChangeEnhanced: (newIndex: number) => void;
  elementHeight: number;
  marginVerticalTop: number;
  marginVerticalBottom: number;
  onChangeTrigger: IOnChangeTrigger;
  centerTop: number;
  listWindowTop: number;
  listWindowBottom: number;
  listWindowCenter: number;
  backgroundWindowTop: number;
  backgroundWindowBottom: number;
  listKeyName: string;
  debug: boolean;
  elementClicksEnabled: boolean;
  scrollAndUpdate: (newIndex: number) => void;
  initialElementIndex: number;
}

export const VirtuosaListRow = ({
  index,
  E,
  onChangeEnhanced,
  elementHeight,
  marginVerticalTop,
  onChangeTrigger,
  centerTop,
  listWindowTop,
  listWindowBottom,
  listWindowCenter,
  backgroundWindowTop,
  backgroundWindowBottom,
  listKeyName,
  debug,
  elementClicksEnabled,
  scrollAndUpdate,
  initialElementIndex,
}: VirtuosaListRowProps) => {
  const top = elementHeight * index;
  const topInclMargins = top + marginVerticalTop;

  let visibilityStatus: IVisibilityStatus;
  if (topInclMargins === centerTop) {
    onChangeEnhanced(index);
    visibilityStatus = "CENTERED_EXACTLY";
  } else {
    const bottom = topInclMargins + elementHeight - 1;
    if (topInclMargins <= listWindowCenter && bottom >= listWindowCenter) {
      if (onChangeTrigger === "CENTERED") {
        onChangeEnhanced(index);
      }
      visibilityStatus = "CENTERED";
    } else if (topInclMargins >= listWindowTop && bottom <= listWindowBottom) {
      visibilityStatus = "VISIBLE_FULLY";
    } else if (
      bottom < backgroundWindowTop ||
      topInclMargins > backgroundWindowBottom
    ) {
      visibilityStatus = "NOT_RENDERED";
    } else if (bottom < listWindowTop || topInclMargins > listWindowBottom) {
      visibilityStatus = "STILL_RENDERED";
    } else {
      visibilityStatus = "VISIBLE_PARTLY";
    }
  }
  const listElementKeyName = `${listKeyName}-element-${index}`;
  return (
    <div
      id={listElementKeyName}
      key={listElementKeyName}
      onClick={
        elementClicksEnabled
          ? () => {
              scrollAndUpdate(index);
            }
          : undefined
      }
      style={{
        border: debug
          ? `${colorMapping[visibilityStatus]} 3px solid`
          : undefined,
        boxSizing: debug ? "border-box" : undefined,
        height: elementHeight,
        minHeight: elementHeight,
        maxHeight: elementHeight,
        width: "100%",
        position: "absolute",
        top: top,
        left: 0,
        scrollSnapAlign: "center",
      }}
    >
      {visibilityStatus !== "NOT_RENDERED" ? (
        <E
          index={index}
          visibilityStatus={visibilityStatus}
          isActive={index === initialElementIndex}
        />
      ) : null}
    </div>
  );
};
