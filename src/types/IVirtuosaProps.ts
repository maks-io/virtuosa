import React from "react";
import { IVirtuosaElement } from "$/types/IVirtuosaElement";
import { IOnChangeTrigger } from "$/types/IOnChangeTrigger";

export interface IVirtuosaProps {
  keyName: string;
  containerHeight: number;
  elementHeight: number;
  elements: IVirtuosaElement[];
  initialElementIndex?: number;
  onChange: (index: number) => void;
  onChangeTrigger?: IOnChangeTrigger;
  centerFirstVertically?: boolean;
  centerLastVertically?: boolean;
  elementClicksEnabled?: boolean;
  backgroundRenderNumber?: number;
  throttleWait?: number;
  scrollBehavior?: "smooth" | "instant";
  debug?: boolean;
  disabled?: boolean;
  containerStyle?: React.CSSProperties;
}
