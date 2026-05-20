export const PAGE_COLUMNS = 12;
export const PAGE_ROWS = 39;
export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

export type BlockType = "text" | "formula" | "graph" | "callout" | "diagram";
export type TextAlign = "left" | "center" | "right";
export type DiagramTemplate = "coordinate-plane" | "free-body" | "ray-optics";

export type BlockLayout = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
};

export type BlockStyle = {
  accent: string;
  background: string;
  fontSize: number;
  lineHeight: number;
  padding: number;
  align: TextAlign;
};

type BaseBlock<TType extends BlockType, TContent> = {
  id: string;
  type: TType;
  title: string;
  subtitle: string;
  layout: BlockLayout;
  style: BlockStyle;
  content: TContent;
};

export type TextBlock = BaseBlock<
  "text",
  {
    markdown: string;
  }
>;

export type FormulaBlock = BaseBlock<
  "formula",
  {
    latex: string;
    note: string;
  }
>;

export type GraphBlock = BaseBlock<
  "graph",
  {
    expression: string;
    caption: string;
  }
>;

export type CalloutBlock = BaseBlock<
  "callout",
  {
    heading: string;
    body: string;
  }
>;

export type DiagramBlock = BaseBlock<
  "diagram",
  {
    template: DiagramTemplate;
    note: string;
  }
>;

export type EditorBlock =
  | TextBlock
  | FormulaBlock
  | GraphBlock
  | CalloutBlock
  | DiagramBlock;

export type BlockBlueprint = {
  type: BlockType;
  label: string;
  description: string;
};

export const BLOCK_BLUEPRINTS: BlockBlueprint[] = [
  {
    type: "text",
    label: "Text",
    description: "Markdown notes with inline LaTeX for dense concept summaries.",
  },
  {
    type: "formula",
    label: "Formula",
    description: "A centered equation block for identities, derivations, and results.",
  },
  {
    type: "graph",
    label: "Graph",
    description: "SVG graph previews rendered through the graph API contract.",
  },
  {
    type: "callout",
    label: "Callout",
    description: "Heuristics, traps, intuition, and exam-day shortcuts.",
  },
  {
    type: "diagram",
    label: "Diagram",
    description: "Template-based visual blocks for mechanics, optics, and planes.",
  },
];
