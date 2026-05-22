"use client";

import { useEffect, useRef, useState } from "react";
import GridLayout, {
  type Layout,
  type LayoutItem,
  type ResizeHandleAxis,
} from "react-grid-layout/legacy";
import { BlockMath } from "react-katex";

import { useEditorStore } from "@/lib/store/editor-store";
import type { GroupBlock as GroupBlockType } from "@/lib/types/editor";
import { cn } from "@/lib/utils";

const GROUP_COLS = 6;
const GROUP_ROW_HEIGHT = 18;
const GROUP_MARGIN: [number, number] = [6, 6];
const GROUP_PADDING: [number, number] = [0, 0];
const RESIZE_HANDLES: ResizeHandleAxis[] = ["n", "e", "s", "w", "ne", "se", "sw", "nw"];

type GroupBlockProps = {
  block: GroupBlockType;
};

function cloneLayout(layout: Layout) {
  return layout.map((item) => ({ ...item }));
}

export function GroupBlock({ block }: GroupBlockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(320);
  const [draftLayout, setDraftLayout] = useState<LayoutItem[] | null>(null);
  const updateGroupLayouts = useEditorStore((state) => state.updateGroupLayouts);
  const persistedLayout = block.content.items.map((item) => item.layout as LayoutItem);
  const activeLayout = draftLayout ?? persistedLayout;

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(220, entry.contentRect.width));
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  function updateInteraction(layout: Layout) {
    setDraftLayout(cloneLayout(layout));
  }

  function stopInteraction(layout: Layout) {
    const nextLayout = cloneLayout(layout);

    updateGroupLayouts(block.id, nextLayout);
    setDraftLayout(null);
  }

  return (
    <div ref={containerRef} className="h-full min-h-0 overflow-hidden rounded-[inherit] bg-[#f8faf4]">
      <GridLayout
        width={width}
        cols={GROUP_COLS}
        rowHeight={GROUP_ROW_HEIGHT}
        margin={GROUP_MARGIN}
        containerPadding={GROUP_PADDING}
        compactType={null}
        preventCollision
        isDraggable
        isResizable
        resizeHandles={RESIZE_HANDLES}
        draggableHandle=".group-block-drag-handle"
        layout={activeLayout}
        onDragStart={updateInteraction}
        onDrag={updateInteraction}
        onDragStop={stopInteraction}
        onResizeStart={updateInteraction}
        onResize={updateInteraction}
        onResizeStop={stopInteraction}
      >
        {block.content.items.map((item) => (
          <div key={item.id}>
            <section
              className={cn(
                "flex h-full min-h-0 flex-col overflow-hidden border border-[#22312714] bg-white/85 p-3 shadow-[0_6px_18px_rgba(25,28,24,0.05)]",
                item.type === "callout" ? "bg-[#fff4ea]" : "bg-white/85",
              )}
              style={{ borderRadius: Math.max(6, block.style.radius - 8) }}
            >
              <div className="group-block-drag-handle mb-2 flex cursor-move items-center justify-between gap-2">
                <span className="truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5d6c62]">
                  {item.title}
                </span>
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: block.style.accent }}
                />
              </div>

              <div className="min-h-0 flex-1 overflow-auto text-[0.92em] leading-[inherit] text-[#253128]">
                {item.type === "formula" ? (
                  <div className="overflow-x-auto text-center">
                    <BlockMath math={item.body} />
                  </div>
                ) : (
                  <p>{item.body}</p>
                )}
              </div>
            </section>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
