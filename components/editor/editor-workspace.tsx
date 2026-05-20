"use client";

import { BlockPalette } from "@/components/editor/block-palette";
import { PaperCanvas } from "@/components/editor/paper-canvas";
import { PropertiesPanel } from "@/components/editor/properties-panel";
import { useEditorStore } from "@/lib/store/editor-store";

export function EditorWorkspace() {
  const blocks = useEditorStore((state) => state.blocks);

  return (
    <main className="min-h-screen px-4 py-5 text-[#1a1e1b] md:px-6">
      <section className="mx-auto flex max-w-[1680px] flex-col gap-5">
        <div className="rounded-[30px] border border-[var(--panel-border)] bg-[var(--panel)] px-6 py-5 shadow-[0_18px_40px_rgba(25,28,24,0.08)] backdrop-blur">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#5d6c62]">Vision MVP</p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-[#1a1e1b] md:text-4xl">
                Build revision sheets like a layout problem, not a canvas problem.
              </h1>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat label="Blocks" value={String(blocks.length)} />
              <Stat label="Paper" value="A4" />
              <Stat label="Grid" value="12 col" />
              <Stat label="Render" value="SVG" />
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
          <BlockPalette />
          <section className="overflow-auto rounded-[32px] border border-[var(--panel-border)] bg-[rgba(255,255,255,0.28)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] md:p-6">
            <PaperCanvas />
          </section>
          <PropertiesPanel />
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-[#22312712] bg-white/80 px-4 py-3">
      <div className="text-[11px] uppercase tracking-[0.24em] text-[#5d6c62]">{label}</div>
      <div className="mt-2 text-lg font-semibold text-[#1a1e1b]">{value}</div>
    </div>
  );
}
