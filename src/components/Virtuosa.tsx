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
  initialElementIndex = 0,
  centerFirstVertically = false,
  centerLastVertically = false,
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

  const marginVerticalTop = useMemo(
    () => (centerFirstVertically ? marginVertical : 0),
    [centerFirstVertically, marginVertical],
  );

  const marginVerticalBottom = useMemo(
    () => (centerLastVertically ? marginVertical : 0),
    [centerLastVertically, marginVertical],
  );

  const listKeyName = `virtuosa-${keyNameSuffix}`;
  const listInnerKeyName = `virtuosa-inner-${keyNameSuffix}`;

  const allElementsHeight = elements.length * elementHeight;

  const virtuosaRef = useRef<HTMLDivElement>();
  const initialElementIndexMemorized = useRef<{
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
    initialElementIndexMemorized.current.processing !== true &&
    initialElementIndexMemorized.current.index !== initialElementIndex;

  useEffect(() => {
    if (hasManualChange) {
      scrollAndUpdate(initialElementIndex);
    }
  }, [hasManualChange, initialElementIndex]);

  if (
    initialElementIndexMemorized.current.processing === true &&
    initialElementIndexMemorized.current.index === initialElementIndex
  ) {
    initialElementIndexMemorized.current.processing = false;
  }

  const onChangeEnhanced = useCallback(
    (newIndex: number) => {
      if (!hasManualChange && initialElementIndex === newIndex) {
        return;
      }
      if (
        !hasManualChange &&
        initialElementIndexMemorized.current.processing === true
      ) {
        return;
      }
      if (hasManualChange && newIndex !== initialElementIndex) {
        return;
      }

      if (hasManualChange) {
        onChange(newIndex);
        initialElementIndexMemorized.current.index = newIndex;
        initialElementIndexMemorized.current.processing = false;
      } else {
        initialElementIndexMemorized.current.processing = true;
        initialElementIndexMemorized.current.index = newIndex;
        onChange(newIndex);
      }
    },
    [hasManualChange, initialElementIndex, onChange],
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
          marginTop: marginVerticalTop,
          marginBottom: marginVerticalBottom,
        }}
      >
        <VirtuosaList
          elements={elements}
          onChangeEnhanced={
            throttleWait ? onChangeEnhanceThrottled : onChangeEnhanced
          }
          elementHeight={elementHeight}
          marginVerticalTop={marginVerticalTop}
          marginVerticalBottom={marginVerticalBottom}
          containerHeight={containerHeight}
          scrollTopOffset={scrollTopOffset}
          onChangeTrigger={onChangeTrigger}
          backgroundRenderNumber={backgroundRenderNumber}
          debug={debug}
          listKeyName={listKeyName}
          elementClicksEnabled={elementClicksEnabled}
          scrollAndUpdate={scrollAndUpdate}
          initialElementIndex={initialElementIndex}
        />
      </div>
    </div>
  );
};
