"use client";

import { useTransition } from "react";
import { AlignCenter, AlignLeft, AlignRight, Eye, EyeOff, Plus } from "lucide-react";

import { useEditorStore } from "@/lib/store/editor-store";
import type { EditorBlock, GroupItemType, TextAlign } from "@/lib/types/editor";
import { cn } from "@/lib/utils";

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
  const updateHeaderVisibility = useEditorStore((state) => state.updateHeaderVisibility);
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

      <button
        type="button"
        className="flex items-center justify-between rounded-2xl border border-[#22312718] bg-white px-3 py-2 text-sm font-semibold text-[#223127] transition hover:border-[#d95f3360]"
        onClick={() => updateHeaderVisibility(block.id, !block.showHeader)}
      >
        <span>{block.showHeader ? "Hide header" : "Show header"}</span>
        {block.showHeader ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>

      <div className="text-xs text-[#5d6c62]">
        {isPending ? "Updating block..." : "Metadata stays lightweight for dense editing."}
      </div>
    </div>
  );
}

function StyleFields({ block }: { block: EditorBlock }) {
  const updateStyle = useEditorStore((state) => state.updateStyle);
  const updateNumericStyle = (
    patch: Partial<Pick<EditorBlock["style"], "fontSize" | "lineHeight" | "padding" | "radius">>,
  ) => updateStyle(block.id, patch);
  const alignments: Array<{ icon: typeof AlignLeft; label: string; value: TextAlign }> = [
    { icon: AlignLeft, label: "Left", value: "left" },
    { icon: AlignCenter, label: "Center", value: "center" },
    { icon: AlignRight, label: "Right", value: "right" },
  ];

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
        <div className="mb-2 flex items-center justify-between gap-3">
          <FieldLabel label="Font Size" />
          <span className="text-xs font-semibold text-[#5d6c62]">{block.style.fontSize}px</span>
        </div>
        <input
          type="range"
          min="11"
          max="22"
          value={block.style.fontSize}
          className="w-full accent-[#d95f33]"
          onInput={(event) =>
            updateNumericStyle({ fontSize: Number(event.currentTarget.value) })
          }
          onChange={(event) =>
            updateNumericStyle({ fontSize: Number(event.currentTarget.value) })
          }
        />
      </label>

      <label>
        <div className="mb-2 flex items-center justify-between gap-3">
          <FieldLabel label="Line Height" />
          <span className="text-xs font-semibold text-[#5d6c62]">{block.style.lineHeight.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="1"
          max="1.8"
          step="0.05"
          value={block.style.lineHeight}
          className="w-full accent-[#d95f33]"
          onInput={(event) =>
            updateNumericStyle({ lineHeight: Number(event.currentTarget.value) })
          }
          onChange={(event) =>
            updateNumericStyle({ lineHeight: Number(event.currentTarget.value) })
          }
        />
      </label>

      <label>
        <div className="mb-2 flex items-center justify-between gap-3">
          <FieldLabel label="Padding" />
          <span className="text-xs font-semibold text-[#5d6c62]">{block.style.padding}px</span>
        </div>
        <input
          type="range"
          min="10"
          max="24"
          value={block.style.padding}
          className="w-full accent-[#d95f33]"
          onInput={(event) =>
            updateNumericStyle({ padding: Number(event.currentTarget.value) })
          }
          onChange={(event) =>
            updateNumericStyle({ padding: Number(event.currentTarget.value) })
          }
        />
      </label>

      <label>
        <div className="mb-2 flex items-center justify-between gap-3">
          <FieldLabel label="Corner Radius" />
          <span className="text-xs font-semibold text-[#5d6c62]">{block.style.radius}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="32"
          value={block.style.radius}
          className="w-full accent-[#d95f33]"
          onInput={(event) =>
            updateNumericStyle({ radius: Number(event.currentTarget.value) })
          }
          onChange={(event) =>
            updateNumericStyle({ radius: Number(event.currentTarget.value) })
          }
        />
      </label>

      <div>
        <FieldLabel label="Alignment" />
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#22312718] bg-white p-1">
          {alignments.map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              title={label}
              className={cn(
                "flex h-10 items-center justify-center rounded-xl text-[#5d6c62] transition",
                block.style.align === value
                  ? "bg-[#223127] text-white"
                  : "hover:bg-[#edf0ea] hover:text-[#223127]",
              )}
              onClick={() => updateStyle(block.id, { align: value })}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentFields({ block }: { block: EditorBlock }) {
  const updateContent = useEditorStore((state) => state.updateContent);
  const addGroupItem = useEditorStore((state) => state.addGroupItem);
  const updateGroupItem = useEditorStore((state) => state.updateGroupItem);

  if (block.type === "text") {
    return (
      <label>
        <FieldLabel label="Markdown" hint="Use $...$ inline, $$...$$ for display math, or \\(...\\)." />
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

  if (block.type === "group") {
    const groupItemTypes: Array<{ label: string; type: GroupItemType }> = [
      { label: "Text", type: "text" },
      { label: "Formula", type: "formula" },
      { label: "Callout", type: "callout" },
    ];

    return (
      <div className="grid gap-4">
        <div>
          <FieldLabel label="Add Mini Block" />
          <div className="grid grid-cols-3 gap-2">
            {groupItemTypes.map((itemType) => (
              <button
                key={itemType.type}
                type="button"
                className="flex items-center justify-center gap-1 rounded-xl border border-[#22312718] bg-white px-2 py-2 text-xs font-semibold text-[#223127] transition hover:border-[#d95f3360]"
                onClick={() => addGroupItem(block.id, itemType.type)}
              >
                <Plus className="h-3.5 w-3.5" />
                {itemType.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          {block.content.items.map((item) => (
            <section
              key={item.id}
              className="rounded-[18px] border border-[#22312712] bg-white/80 p-3"
            >
              <label>
                <FieldLabel label={item.type === "formula" ? "Formula Title" : "Mini Title"} />
                <input
                  className="w-full rounded-2xl border border-[#22312718] bg-white px-3 py-2 text-sm outline-none transition focus:border-[#d95f33]"
                  value={item.title}
                  onChange={(event) =>
                    updateGroupItem(block.id, item.id, { title: event.target.value })
                  }
                />
              </label>

              <label className="mt-3 block">
                <FieldLabel label={item.type === "formula" ? "LaTeX" : "Body"} />
                <textarea
                  className="h-20 w-full rounded-[18px] border border-[#22312718] bg-white px-3 py-3 text-sm outline-none transition focus:border-[#d95f33]"
                  value={item.body}
                  onChange={(event) =>
                    updateGroupItem(block.id, item.id, { body: event.target.value })
                  }
                />
              </label>
            </section>
          ))}
        </div>
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
