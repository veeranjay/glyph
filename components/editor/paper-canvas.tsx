"use client";

import GridLayout, { type LayoutItem } from "react-grid-layout/legacy";

import { BlockRenderer } from "@/components/blocks/block-renderer";
import { useEditorStore } from "@/lib/store/editor-store";
import { A4_HEIGHT, A4_WIDTH, PAGE_COLUMNS, PAGE_ROWS } from "@/lib/types/editor";

export function PaperCanvas() {
  const blocks = useEditorStore((state) => state.blocks);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectBlock = useEditorStore((state) => state.selectBlock);
  const updateLayouts = useEditorStore((state) => state.updateLayouts);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-full border border-[#22312716] bg-[var(--panel)] px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#5d6c62] shadow-[0_10px_25px_rgba(25,28,24,0.06)] backdrop-blur">
        A4 paper · 12-column grid · printable density
      </div>

      <div
        className="paper-grid overflow-hidden rounded-[36px] border border-white/70 shadow-[0_35px_80px_var(--paper-shadow)]"
        style={{ width: A4_WIDTH, height: A4_HEIGHT }}
      >
        <GridLayout
          width={A4_WIDTH}
          cols={PAGE_COLUMNS}
          rowHeight={20}
          margin={[8, 8]}
          containerPadding={[16, 16]}
          maxRows={PAGE_ROWS}
          isResizable
          isDraggable
          compactType="vertical"
          draggableHandle=".block-drag-handle"
          layout={blocks.map((block) => block.layout as LayoutItem)}
          onLayoutChange={(layout) => updateLayouts([...layout])}
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
