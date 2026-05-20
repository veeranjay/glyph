"use client";

import {
  ChartSpline,
  DraftingCompass,
  FunctionSquare,
  Lightbulb,
  NotebookPen,
} from "lucide-react";

import { useEditorStore } from "@/lib/store/editor-store";
import { BLOCK_BLUEPRINTS, PAGE_COLUMNS, PAGE_ROWS } from "@/lib/types/editor";

const icons = {
  text: NotebookPen,
  formula: FunctionSquare,
  graph: ChartSpline,
  callout: Lightbulb,
  diagram: DraftingCompass,
};

export function BlockPalette() {
  const blocks = useEditorStore((state) => state.blocks);
  const addBlock = useEditorStore((state) => state.addBlock);
  const filledUnits = blocks.reduce((sum, block) => sum + block.layout.w * block.layout.h, 0);
  const density = Math.min(100, Math.round((filledUnits / (PAGE_COLUMNS * PAGE_ROWS)) * 100));

  return (
    <aside className="rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-[0_18px_40px_rgba(25,28,24,0.08)] backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#5d6c62]">Palette</p>
          <h2 className="mt-2 text-xl font-semibold text-[#1a1e1b]">Dense study blocks</h2>
        </div>
        <div className="rounded-full bg-[#fff4ea] px-3 py-1 text-xs font-semibold text-[#d95f33]">
          {density}% filled
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {BLOCK_BLUEPRINTS.map((blueprint) => {
          const Icon = icons[blueprint.type];

          return (
            <button
              key={blueprint.type}
              type="button"
              className="group rounded-[22px] border border-[#22312712] bg-white/85 p-4 text-left transition hover:-translate-y-0.5 hover:border-[#d95f3360] hover:shadow-[0_10px_28px_rgba(25,28,24,0.08)]"
              onClick={() => addBlock(blueprint.type)}
            >
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-[#edf0ea] p-2 text-[#223127] transition group-hover:bg-[#fff4ea] group-hover:text-[#d95f33]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1a1e1b]">{blueprint.label}</div>
                  <p className="mt-1 text-sm leading-5 text-[#516259]">{blueprint.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-[22px] border border-dashed border-[#22312720] bg-[#f7f7f2] px-4 py-4">
        <p className="text-sm font-semibold text-[#223127]">MVP bias</p>
        <p className="mt-2 text-sm leading-5 text-[#516259]">
          The editor is fixed to an A4 printable grid so we can optimize density, spacing, and export quality before chasing freeform canvas complexity.
        </p>
      </div>
    </aside>
  );
}
