import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import throttle from "lodash.throttle";
import { IVirtuosaProps } from "$/types/IVirtuosaProps";
import { VirtuosaList } from "$/components/VirtuosaList";

export const Virtuosa = ({
  keyName: keyNameSuffix,
  containerStyle = {},
  containerHeight,
  elementHeight,
  elements,
  onChange,
  onChangeTrigger = "CENTERED",
  throttleWait = 32,
  currentIndex = 0,
  backgroundRenderNumber = 4,
  elementClicksEnabled = true,
  scrollBehavior = "smooth",
  disabled = false,
  debug = false,
}: IVirtuosaProps) => {
  const [scrollTopOffset, setScrollTopOffset] = useState<number>(0);

  const marginVertical = useMemo(
    () => containerHeight / 2 - elementHeight / 2,
    [containerHeight, elementHeight],
  );

  const listKeyName = `virtuosa-${keyNameSuffix}`;
  const listInnerKeyName = `virtuosa-inner-${keyNameSuffix}`;

  const allElementsHeight = elements.length * elementHeight;

  const virtuosaRef = useRef<HTMLDivElement>();
  const currentIndexMemorized = useRef<{
    index: number;
    processing: boolean;
  }>({ index: -1, processing: false });

  const scrollAndUpdate = useCallback(
    (newIndex: number) => {
      const topTarget = newIndex * elementHeight;
      virtuosaRef.current.scrollTo({
        top: topTarget,
        behavior: scrollBehavior,
      });
    },
    [elementHeight, scrollBehavior],
  );

  const hasManualChange: boolean =
    currentIndexMemorized.current.processing !== true &&
    currentIndexMemorized.current.index !== currentIndex;

  useEffect(() => {
    if (hasManualChange) {
      scrollAndUpdate(currentIndex);
    }
  }, [hasManualChange, currentIndex]);

  if (
    currentIndexMemorized.current.processing === true &&
    currentIndexMemorized.current.index === currentIndex
  ) {
    currentIndexMemorized.current.processing = false;
  }

  const onChangeEnhanced = useCallback(
    (newIndex: number) => {
      if (!hasManualChange && currentIndex === newIndex) {
        return;
      }
      if (
        !hasManualChange &&
        currentIndexMemorized.current.processing === true
      ) {
        return;
      }
      if (hasManualChange && newIndex !== currentIndex) {
        return;
      }

      if (hasManualChange) {
        onChange(newIndex);
        currentIndexMemorized.current.index = newIndex;
        currentIndexMemorized.current.processing = false;
      } else {
        currentIndexMemorized.current.processing = true;
        currentIndexMemorized.current.index = newIndex;
        onChange(newIndex);
      }
    },
    [hasManualChange, currentIndex, onChange],
  );

  const onChangeEnhanceThrottled = useCallback(
    throttle(onChangeEnhanced, throttleWait, {
      leading: false,
      trailing: true,
    }),
    [onChangeEnhanced, throttleWait],
  );

  return (
    <div
      id={listKeyName}
      key={listKeyName}
      ref={virtuosaRef}
      style={{
        ...containerStyle,
        height: containerHeight,
        minHeight: containerHeight,
        maxHeight: containerHeight,
        overflowX: "hidden",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        filter: disabled ? "grayscale(1)" : "grayscale(0)",
      }}
      onScroll={(event) => {
        const target = event.target as HTMLDivElement;
        setScrollTopOffset(target.scrollTop);
      }}
    >
      <div
        id={listInnerKeyName}
        key={listInnerKeyName}
        style={{
          position: "relative",
          height: allElementsHeight,
          minHeight: allElementsHeight,
          maxHeight: allElementsHeight,
          marginTop: marginVertical,
          marginBottom: marginVertical,
        }}
      >
        <VirtuosaList
          elements={elements}
          onChangeEnhanced={
            throttleWait ? onChangeEnhanceThrottled : onChangeEnhanced
          }
          elementHeight={elementHeight}
          marginVertical={marginVertical}
          containerHeight={containerHeight}
          scrollTopOffset={scrollTopOffset}
          onChangeTrigger={onChangeTrigger}
          backgroundRenderNumber={backgroundRenderNumber}
          debug={debug}
          listKeyName={listKeyName}
          elementClicksEnabled={elementClicksEnabled}
          scrollAndUpdate={scrollAndUpdate}
          currentIndex={currentIndex}
        />
      </div>
    </div>
  );
};
