"use client";

import Markdown from "react-markdown";
import { BlockMath } from "react-katex";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { GraphBlock } from "@/components/blocks/graph-block";
import { renderDiagramTemplate } from "@/lib/rendering/diagram-templates";
import type { EditorBlock } from "@/lib/types/editor";
import { cn } from "@/lib/utils";

type BlockRendererProps = {
  block: EditorBlock;
  selected: boolean;
  onSelect: () => void;
};

export function BlockRenderer({ block, selected, onSelect }: BlockRendererProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[20px] border bg-[var(--paper)] shadow-[0_10px_35px_rgba(25,28,24,0.08)]",
        selected ? "border-[var(--accent)] ring-2 ring-[rgba(217,95,51,0.18)]" : "border-[var(--panel-border)]",
      )}
      style={{
        backgroundColor: block.style.background,
        padding: block.style.padding,
        textAlign: block.style.align,
        fontSize: `${block.style.fontSize}px`,
        lineHeight: block.style.lineHeight,
      }}
      onMouseDown={onSelect}
    >
      <div className="block-drag-handle mb-3 flex cursor-move items-start justify-between gap-3 rounded-2xl border border-[#22312714] bg-white/70 px-3 py-2">
        <div>
          <div className="text-[10px] uppercase tracking-[0.26em] text-[#5d6c62]">{block.title}</div>
          <div className="mt-1 text-sm font-medium text-[#1a1e1b]">{block.subtitle}</div>
        </div>
        <div
          className="mt-1 h-3 w-3 rounded-full"
          style={{ backgroundColor: block.style.accent }}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-auto text-[#1d231f]">
        {block.type === "text" ? (
          <div className="markdown-preview">
            <Markdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {block.content.markdown}
            </Markdown>
          </div>
        ) : null}

        {block.type === "formula" ? (
          <div className="flex h-full flex-col justify-center gap-4">
            <div className="overflow-x-auto rounded-[18px] bg-white/70 px-4 py-5">
              <BlockMath math={block.content.latex} />
            </div>
            <p className="text-sm text-[#405047]">{block.content.note}</p>
          </div>
        ) : null}

        {block.type === "graph" ? (
          <GraphBlock
            expression={block.content.expression}
            caption={block.content.caption}
          />
        ) : null}

        {block.type === "callout" ? (
          <div className="flex h-full flex-col gap-3">
            <div
              className="inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{
                backgroundColor: `${block.style.accent}22`,
                color: block.style.accent,
              }}
            >
              {block.content.heading}
            </div>
            <p className="text-[15px] leading-6 text-[#253128]">{block.content.body}</p>
          </div>
        ) : null}

        {block.type === "diagram" ? (
          <div className="flex h-full flex-col gap-4">
            <div
              className="overflow-hidden rounded-[18px] border border-[#2231271c] bg-white/75"
              dangerouslySetInnerHTML={{
                __html: renderDiagramTemplate(block.content.template),
              }}
            />
            <p className="text-sm text-[#405047]">{block.content.note}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
