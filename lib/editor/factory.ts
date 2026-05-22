import {
  type BlockLayout,
  type BlockType,
  type DiagramBlock,
  type EditorBlock,
  type GroupItem,
  type GroupItemType,
} from "@/lib/types/editor";

const baseStyle = {
  accent: "#d95f33",
  background: "#fffdfa",
  fontSize: 14,
  lineHeight: 1.35,
  padding: 14,
  radius: 20,
  align: "left" as const,
};

const starterLayouts: Record<BlockType, Omit<BlockLayout, "i" | "y">> = {
  text: { x: 0, w: 5, h: 10, minW: 3, minH: 6 },
  formula: { x: 5, w: 3, h: 6, minW: 3, minH: 4 },
  graph: { x: 8, w: 4, h: 12, minW: 4, minH: 7 },
  callout: { x: 0, w: 4, h: 7, minW: 3, minH: 5 },
  diagram: { x: 4, w: 4, h: 10, minW: 4, minH: 7 },
  group: { x: 0, w: 6, h: 14, minW: 4, minH: 8 },
};

export function createGroupItem(type: GroupItemType, index: number): GroupItem {
  const id = `group-item-${index}`;

  if (type === "formula") {
    return {
      id,
      type,
      title: "Formula",
      body: "v^2 = u^2 + 2as",
      layout: { i: id, x: 3, y: 0, w: 3, h: 4, minW: 2, minH: 3 },
    };
  }

  if (type === "callout") {
    return {
      id,
      type,
      title: "Trap",
      body: "Check sign convention before substituting values.",
      layout: { i: id, x: 0, y: 5, w: 3, h: 4, minW: 2, minH: 3 },
    };
  }

  return {
    id,
    type,
    title: "Mini note",
    body: "Group related facts into a local structure before compressing the page.",
    layout: { i: id, x: 0, y: 0, w: 3, h: 5, minW: 2, minH: 3 },
  };
}

export function createBlock(type: BlockType, index: number): EditorBlock {
  const id = `${type}-${index}`;
  const layout = {
    i: id,
    y: index * 4,
    ...starterLayouts[type],
  };

  switch (type) {
    case "text":
      return {
        id,
        type,
        title: "Structured Notes",
        subtitle: "Concept summary",
        showHeader: true,
        layout,
        style: baseStyle,
        content: {
          markdown:
            "## Conservation of Energy\n- Total mechanical energy stays constant when non-conservative work is zero.\n- Use $K_i + U_i = K_f + U_f$ before expanding algebra.\n- Pair formulas with one sentence of intuition.",
        },
      };
    case "formula":
      return {
        id,
        type,
        title: "Core Formula",
        subtitle: "High-signal equation",
        showHeader: true,
        layout,
        style: { ...baseStyle, align: "center", fontSize: 16 },
        content: {
          latex: "E_{\\text{mech}} = K + U",
          note: "Best used when the only work done is conservative.",
        },
      };
    case "graph":
      return {
        id,
        type,
        title: "Graph",
        subtitle: "Function preview",
        showHeader: true,
        layout,
        style: baseStyle,
        content: {
          expression: "y = x^2 - 2x - 3",
          caption: "Quick parabola scan: roots at -1 and 3, vertex at (1, -4).",
        },
      };
    case "callout":
      return {
        id,
        type,
        title: "Insight",
        subtitle: "Dense revision hint",
        showHeader: true,
        layout,
        style: { ...baseStyle, background: "#fff4ea" },
        content: {
          heading: "Exam heuristic",
          body: "If the problem looks long, identify the invariant first. That often removes half the algebra.",
        },
      };
    case "diagram":
      return {
        id,
        type,
        title: "Diagram",
        subtitle: "Template visual",
        showHeader: true,
        layout,
        style: baseStyle,
        content: {
          template: "free-body",
          note: "Start with force arrows before writing component equations.",
        },
      };
    case "group":
      return {
        id,
        type,
        title: "Section Group",
        subtitle: "Nested mini page",
        showHeader: true,
        layout,
        style: { ...baseStyle, background: "#fbfcf7", padding: 12 },
        content: {
          columns: 6,
          items: [
            createGroupItem("text", 1),
            createGroupItem("formula", 2),
            createGroupItem("callout", 3),
          ],
        },
      };
  }
}

export function createInitialBlocks(): EditorBlock[] {
  const diagramBlock = createBlock("diagram", 5) as DiagramBlock;

  return [
    createBlock("text", 1),
    createBlock("formula", 2),
    createBlock("graph", 3),
    createBlock("callout", 4),
    {
      ...diagramBlock,
      content: {
        template: "coordinate-plane",
        note: "Use a visual anchor for intercepts, symmetry, and turning points.",
      },
      layout: {
        i: "diagram-5",
        x: 4,
        y: 10,
        w: 4,
        h: 11,
        minW: 4,
        minH: 7,
      },
    },
  ];
}
