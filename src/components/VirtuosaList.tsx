import React from "react";
import { IVirtuosaElement } from "$/types/IVirtuosaElement";
import { IOnChangeTrigger } from "$/types/IOnChangeTrigger";
import { VirtuosaListRow } from "$/components/VirtuosaListRow";

interface VirtuosaListProps {
  elements: IVirtuosaElement[];
  onChangeEnhanced: (newIndex: number) => void;
  elementHeight: number;
  marginVerticalTop: number;
  marginVerticalBottom: number;
  containerHeight: number;
  scrollTopOffset: number;
  onChangeTrigger: IOnChangeTrigger;
  backgroundRenderNumber: number;
  debug: boolean;
  listKeyName: string;
  elementClicksEnabled: boolean;
  scrollAndUpdate: (newIndex: number) => void;
  currentIndex: number;
}

export const VirtuosaList = ({
  elements,
  onChangeEnhanced,
  elementHeight,
  marginVerticalTop,
  marginVerticalBottom,
  containerHeight,
  scrollTopOffset,
  onChangeTrigger,
  backgroundRenderNumber,
  debug,
  listKeyName,
  elementClicksEnabled,
  scrollAndUpdate,
  currentIndex,
}: VirtuosaListProps) => {
  // visible window:
  const listWindowTop = scrollTopOffset;
  const listWindowBottom = listWindowTop + containerHeight;
  const listWindowCenter = (listWindowBottom + listWindowTop) / 2;

  // window for background rendering:
  const backgroundRenderHeight = backgroundRenderNumber * elementHeight;
  const backgroundWindowTop = listWindowTop - backgroundRenderHeight;
  const backgroundWindowBottom = listWindowBottom + backgroundRenderHeight;

  const centerTop = (containerHeight - elementHeight) / 2 + scrollTopOffset;

  return elements.map((E, index) => (
    <VirtuosaListRow
      index={index}
      E={E}
      centerTop={centerTop}
      onChangeEnhanced={onChangeEnhanced}
      elementHeight={elementHeight}
      marginVerticalTop={marginVerticalTop}
      marginVerticalBottom={marginVerticalBottom}
      onChangeTrigger={onChangeTrigger}
      listWindowTop={listWindowTop}
      listWindowBottom={listWindowBottom}
      listWindowCenter={listWindowCenter}
      backgroundWindowTop={backgroundWindowTop}
      backgroundWindowBottom={backgroundWindowBottom}
      listKeyName={listKeyName}
      debug={debug}
      elementClicksEnabled={elementClicksEnabled}
      scrollAndUpdate={scrollAndUpdate}
      currentIndex={currentIndex}
    />
  ));
};
