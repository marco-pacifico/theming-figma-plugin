export type NodeWithChildren =
  | ComponentNode
  | ComponentSetNode
  | FrameNode
  | PageNode
  | InstanceNode
  | GroupNode
  | SectionNode;

export type NodeWithFills = FrameNode | TextNode | InstanceNode;

export type NodeFields = {
  readonly [field in VariableBindableNodeField]?: VariableAlias;
};

export type BoundVariables = NodeFields & {
  readonly fills: VariableAlias[];
  readonly strokes: VariableAlias[];
  readonly effects: VariableAlias[];
  readonly layoutGrids: VariableAlias[];
  readonly componentProperties: { [propertyName: string]: VariableAlias };
  readonly textRangeFills: VariableAlias[];
};

export type ColorScale = {
  [key: string]: string | number;
  BASE: number;
  FOREGROUND: number;
  "50": string;
  "100": string;
  "200": string;
  "300": string;
  "400": string;
  "500": string;
  "600": string;
  "700": string;
  "800": string;
  "900": string;
  "950": string;
};

export type NeutralScale = {
  [key: string]: string | number;
  "50": string;
  "100": string;
  "200": string;
  "300": string;
  "400": string;
  "500": string;
  "600": string;
  "700": string;
  "800": string;
  "900": string;
  "950": string;
};

export type RadiusScale = {
  [key: string]: string;
  BASE: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
};

export type Heading = {
  [key: string]: string;
  font: string;
  weight: string;
  style: string;
};

export type FontWeightsMap = {
  [weight: string]: string;
};

export type Theme = {
  [key: string]: ColorScale | NeutralScale | RadiusScale | Heading | string;
  name: string;
  brand: ColorScale;
  accent: ColorScale;
  supplemental: ColorScale;
  neutral: NeutralScale;
  radius: RadiusScale;
  heading: Heading;
};

export type SemanticColorMap = {
  [type: string]: {
    [role: string]: {
      [prominence: string]: number | string; // number is the index of the shade, string is white
    };
  };
};
