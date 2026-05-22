"use client";

import { useState } from "react";
import GridLayout, {
  type Layout,
  type LayoutItem,
  type ResizeHandleAxis,
} from "react-grid-layout/legacy";

import { BlockRenderer } from "@/components/blocks/block-renderer";
import { useEditorStore } from "@/lib/store/editor-store";
import { A4_HEIGHT, A4_WIDTH, PAGE_COLUMNS, PAGE_ROWS } from "@/lib/types/editor";

const ROW_HEIGHT = 20;
const MARGIN: [number, number] = [8, 8];
const PADDING: [number, number] = [16, 16];
const COL_WIDTH = (A4_WIDTH - PADDING[0] * 2 - MARGIN[0] * (PAGE_COLUMNS - 1)) / PAGE_COLUMNS;
const RESIZE_HANDLES: ResizeHandleAxis[] = ["n", "e", "s", "w", "ne", "se", "sw", "nw"];

type SnapGuides = {
  activeHorizontal: number[];
  activeVertical: number[];
  matchedHorizontal: number[];
  matchedVertical: number[];
};

function unique(values: number[]) {
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

function gridXToPx(edge: number) {
  if (edge <= 0) {
    return PADDING[0];
  }

  return PADDING[0] + edge * COL_WIDTH + (edge - 1) * MARGIN[0];
}

function gridYToPx(edge: number) {
  if (edge <= 0) {
    return PADDING[1];
  }

  return PADDING[1] + edge * ROW_HEIGHT + (edge - 1) * MARGIN[1];
}

function getSnapGuides(layout: Layout, activeItem: LayoutItem | null): SnapGuides | null {
  if (!activeItem) {
    return null;
  }

  const activeVertical = unique([activeItem.x, activeItem.x + activeItem.w]);
  const activeHorizontal = unique([activeItem.y, activeItem.y + activeItem.h]);
  const otherItems = layout.filter((item) => item.i !== activeItem.i);
  const otherVerticalEdges = new Set(
    otherItems.flatMap((item) => [item.x, item.x + item.w]),
  );
  const otherHorizontalEdges = new Set(
    otherItems.flatMap((item) => [item.y, item.y + item.h]),
  );

  return {
    activeHorizontal,
    activeVertical,
    matchedHorizontal: activeHorizontal.filter((edge) => otherHorizontalEdges.has(edge)),
    matchedVertical: activeVertical.filter((edge) => otherVerticalEdges.has(edge)),
  };
}

function cloneLayout(layout: Layout) {
  return layout.map((item) => ({ ...item }));
}

function SnapGuideLayer({ guides }: { guides: SnapGuides | null }) {
  if (!guides) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {guides.activeVertical.map((edge) => (
        <div
          key={`active-v-${edge}`}
          className="absolute top-4 h-[calc(100%-32px)] w-px bg-[#d95f332e]"
          style={{ left: gridXToPx(edge) }}
        />
      ))}
      {guides.activeHorizontal.map((edge) => (
        <div
          key={`active-h-${edge}`}
          className="absolute left-4 h-px w-[calc(100%-32px)] bg-[#d95f332e]"
          style={{ top: gridYToPx(edge) }}
        />
      ))}
      {guides.matchedVertical.map((edge) => (
        <div
          key={`matched-v-${edge}`}
          className="absolute top-4 h-[calc(100%-32px)] w-px border-l border-dashed border-[#31543e66]"
          style={{ left: gridXToPx(edge) }}
        >
          <span className="absolute -left-1 top-0 h-2 w-2 rounded-full bg-[#31543e99]" />
          <span className="absolute -bottom-0 -left-1 h-2 w-2 rounded-full bg-[#31543e99]" />
        </div>
      ))}
      {guides.matchedHorizontal.map((edge) => (
        <div
          key={`matched-h-${edge}`}
          className="absolute left-4 h-px w-[calc(100%-32px)] border-t border-dashed border-[#31543e66]"
          style={{ top: gridYToPx(edge) }}
        >
          <span className="absolute -left-0 -top-1 h-2 w-2 rounded-full bg-[#31543e99]" />
          <span className="absolute -right-0 -top-1 h-2 w-2 rounded-full bg-[#31543e99]" />
        </div>
      ))}
    </div>
  );
}

export function PaperCanvas() {
  const blocks = useEditorStore((state) => state.blocks);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const updateLayouts = useEditorStore((state) => state.updateLayouts);
  const [snapGuides, setSnapGuides] = useState<SnapGuides | null>(null);
  const [draftLayout, setDraftLayout] = useState<LayoutItem[] | null>(null);
  const persistedLayout = blocks.map((block) => block.layout as LayoutItem);
  const activeLayout = draftLayout ?? persistedLayout;

  function startInteraction(layout: Layout, activeItem: LayoutItem | null) {
    const nextLayout = cloneLayout(layout);

    setDraftLayout(nextLayout);
    setSnapGuides(getSnapGuides(nextLayout, activeItem));
    if (activeItem) {
      selectBlock(activeItem.i);
    }
  }

  function updateInteraction(layout: Layout, activeItem: LayoutItem | null) {
    const nextLayout = cloneLayout(layout);

    setDraftLayout(nextLayout);
    setSnapGuides(getSnapGuides(nextLayout, activeItem));
  }

  function stopInteraction(layout: Layout, activeItem: LayoutItem | null) {
    const nextLayout = cloneLayout(layout);

    updateLayouts(nextLayout);
    setDraftLayout(null);
    setSnapGuides(null);
    if (activeItem) {
      selectBlock(activeItem.i);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-full border border-[#22312716] bg-[var(--panel)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#5d6c62] shadow-[0_10px_25px_rgba(25,28,24,0.06)] backdrop-blur">
        A4 paper · 12-column grid · printable density
      </div>

      <div
        className="paper-grid relative overflow-hidden rounded-[36px] border border-white/70 shadow-[0_35px_80px_var(--paper-shadow)]"
        style={{ width: A4_WIDTH, height: A4_HEIGHT }}
      >
        <SnapGuideLayer guides={snapGuides} />
        <GridLayout
          width={A4_WIDTH}
          cols={PAGE_COLUMNS}
          rowHeight={ROW_HEIGHT}
          margin={MARGIN}
          containerPadding={PADDING}
          maxRows={PAGE_ROWS}
          isResizable
          resizeHandles={RESIZE_HANDLES}
          isDraggable
          compactType={null}
          preventCollision
          draggableHandle=".block-drag-handle"
          layout={activeLayout}
          onDragStart={(layout, _oldItem, newItem) => startInteraction(layout, newItem)}
          onDrag={(layout, _oldItem, newItem) => updateInteraction(layout, newItem)}
          onDragStop={(layout, _oldItem, newItem) => stopInteraction(layout, newItem)}
          onResizeStart={(layout, _oldItem, newItem) => startInteraction(layout, newItem)}
          onResize={(layout, _oldItem, newItem) => updateInteraction(layout, newItem)}
          onResizeStop={(layout, _oldItem, newItem) => stopInteraction(layout, newItem)}
        >
          {blocks.map((block) => (
            <div key={block.id}>
              <BlockRenderer
                block={block}
                selected={selectedBlockId === block.id}
                onSelect={() => selectBlock(block.id)}
              />
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  );
}
