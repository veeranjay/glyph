"use client";

import { useTransition } from "react";

import { useEditorStore } from "@/lib/store/editor-store";
import type { EditorBlock, TextAlign } from "@/lib/types/editor";

const accentSwatches = ["#d95f33", "#31543e", "#335c81", "#946846", "#7f4c85"];

type FieldLabelProps = {
  label: string;
  hint?: string;
};

function FieldLabel({ label, hint }: FieldLabelProps) {
  return (
    <div className="mb-2">
      <div className="text-sm font-semibold text-[#1a1e1b]">{label}</div>
      {hint ? <div className="mt-1 text-xs text-[#5d6c62]">{hint}</div> : null}
    </div>
  );
}

function MetaFields({ block }: { block: EditorBlock }) {
  const updateMeta = useEditorStore((state) => state.updateMeta);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-3">
      <label>
        <FieldLabel label="Title" />
        <input
          className="w-full rounded-2xl border border-[#22312718] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#d95f33]"
          value={block.title}
          onChange={(event) =>
            startTransition(() => updateMeta(block.id, { title: event.target.value }))
          }
        />
      </label>

      <label>
        <FieldLabel label="Subtitle" />
        <input
          className="w-full rounded-2xl border border-[#22312718] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#d95f33]"
          value={block.subtitle}
          onChange={(event) =>
            startTransition(() => updateMeta(block.id, { subtitle: event.target.value }))
          }
        />
      </label>

      <div className="text-xs text-[#5d6c62]">
        {isPending ? "Updating block..." : "Metadata stays lightweight for dense editing."}
      </div>
    </div>
  );
}

function StyleFields({ block }: { block: EditorBlock }) {
  const updateStyle = useEditorStore((state) => state.updateStyle);

  return (
    <div className="grid gap-4">
      <div>
        <FieldLabel label="Accent" hint="Use color sparingly to keep the sheet printable." />
        <div className="flex flex-wrap gap-2">
          {accentSwatches.map((swatch) => (
            <button
              key={swatch}
              type="button"
              className="h-8 w-8 rounded-full border-2 transition"
              style={{
                backgroundColor: swatch,
                borderColor: block.style.accent === swatch ? "#1a1e1b" : "transparent",
              }}
              onClick={() => updateStyle(block.id, { accent: swatch })}
            />
          ))}
        </div>
      </div>

      <label>
        <FieldLabel label="Font Size" />
        <input
          type="range"
          min="11"
          max="22"
          value={block.style.fontSize}
          className="w-full accent-[#d95f33]"
          onChange={(event) =>
            updateStyle(block.id, { fontSize: Number(event.target.value) })
          }
        />
      </label>

      <label>
        <FieldLabel label="Line Height" />
        <input
          type="range"
          min="1"
          max="1.8"
          step="0.05"
          value={block.style.lineHeight}
          className="w-full accent-[#d95f33]"
          onChange={(event) =>
            updateStyle(block.id, { lineHeight: Number(event.target.value) })
          }
        />
      </label>

      <label>
        <FieldLabel label="Padding" />
        <input
          type="range"
          min="10"
          max="24"
          value={block.style.padding}
          className="w-full accent-[#d95f33]"
          onChange={(event) =>
            updateStyle(block.id, { padding: Number(event.target.value) })
          }
        />
      </label>

      <label>
        <FieldLabel label="Alignment" />
        <select
          className="w-full rounded-2xl border border-[#22312718] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#d95f33]"
          value={block.style.align}
          onChange={(event) =>
            updateStyle(block.id, { align: event.target.value as TextAlign })
          }
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
    </div>
  );
}

function ContentFields({ block }: { block: EditorBlock }) {
  const updateContent = useEditorStore((state) => state.updateContent);

  if (block.type === "text") {
    return (
      <label>
        <FieldLabel label="Markdown" hint="Supports headings, lists, and inline LaTeX." />
        <textarea
          className="h-44 w-full rounded-[22px] border border-[#22312718] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#d95f33]"
          value={block.content.markdown}
          onChange={(event) => updateContent(block.id, { markdown: event.target.value })}
        />
      </label>
    );
  }

  if (block.type === "formula") {
    return (
      <div className="grid gap-3">
        <label>
          <FieldLabel label="LaTeX" />
          <textarea
            className="h-24 w-full rounded-[22px] border border-[#22312718] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#d95f33]"
            value={block.content.latex}
            onChange={(event) => updateContent(block.id, { latex: event.target.value })}
          />
        </label>
        <label>
          <FieldLabel label="Note" />
          <textarea
            className="h-24 w-full rounded-[22px] border border-[#22312718] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#d95f33]"
            value={block.content.note}
            onChange={(event) => updateContent(block.id, { note: event.target.value })}
          />
        </label>
      </div>
    );
  }

  if (block.type === "graph") {
    return (
      <div className="grid gap-3">
        <label>
          <FieldLabel label="Expression" hint="Examples: y = x^2, sin(x), (x-2)^3" />
          <input
            className="w-full rounded-2xl border border-[#22312718] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#d95f33]"
            value={block.content.expression}
            onChange={(event) => updateContent(block.id, { expression: event.target.value })}
          />
        </label>
        <label>
          <FieldLabel label="Caption" />
          <textarea
            className="h-24 w-full rounded-[22px] border border-[#22312718] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#d95f33]"
            value={block.content.caption}
            onChange={(event) => updateContent(block.id, { caption: event.target.value })}
          />
        </label>
      </div>
    );
  }

  if (block.type === "callout") {
    return (
      <div className="grid gap-3">
        <label>
          <FieldLabel label="Heading" />
          <input
            className="w-full rounded-2xl border border-[#22312718] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#d95f33]"
            value={block.content.heading}
            onChange={(event) => updateContent(block.id, { heading: event.target.value })}
          />
        </label>
        <label>
          <FieldLabel label="Body" />
          <textarea
            className="h-28 w-full rounded-[22px] border border-[#22312718] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#d95f33]"
            value={block.content.body}
            onChange={(event) => updateContent(block.id, { body: event.target.value })}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <label>
        <FieldLabel label="Template" />
        <select
          className="w-full rounded-2xl border border-[#22312718] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#d95f33]"
          value={block.content.template}
          onChange={(event) => updateContent(block.id, { template: event.target.value })}
        >
          <option value="coordinate-plane">Coordinate plane</option>
          <option value="free-body">Free body</option>
          <option value="ray-optics">Ray optics</option>
        </select>
      </label>
      <label>
        <FieldLabel label="Note" />
        <textarea
          className="h-28 w-full rounded-[22px] border border-[#22312718] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#d95f33]"
          value={block.content.note}
          onChange={(event) => updateContent(block.id, { note: event.target.value })}
        />
      </label>
    </div>
  );
}

export function PropertiesPanel() {
  const blocks = useEditorStore((state) => state.blocks);
  const selectedBlockId = useEditorStore((state) => state.selectedBlockId);
  const selectedBlock = blocks.find((block) => block.id === selectedBlockId) ?? null;

  return (
    <aside className="rounded-[28px] border border-[var(--panel-border)] bg-[var(--panel)] p-5 shadow-[0_18px_40px_rgba(25,28,24,0.08)] backdrop-blur">
      <p className="text-[11px] uppercase tracking-[0.28em] text-[#5d6c62]">Inspector</p>
      <h2 className="mt-2 text-xl font-semibold text-[#1a1e1b]">Density controls</h2>

      {selectedBlock ? (
        <div className="mt-5 space-y-6">
          <section className="rounded-[22px] border border-[#22312712] bg-white/80 p-4">
            <MetaFields block={selectedBlock} />
          </section>

          <section className="rounded-[22px] border border-[#22312712] bg-white/80 p-4">
            <ContentFields block={selectedBlock} />
          </section>

          <section className="rounded-[22px] border border-[#22312712] bg-white/80 p-4">
            <StyleFields block={selectedBlock} />
          </section>
        </div>
      ) : (
        <div className="mt-5 rounded-[22px] border border-dashed border-[#22312722] bg-[#f7f7f2] p-4 text-sm leading-6 text-[#516259]">
          Select a block on the page to edit its content, density, and visual emphasis.
        </div>
      )}
    </aside>
  );
}
