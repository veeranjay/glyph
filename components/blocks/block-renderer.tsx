"use client";

import Markdown from "react-markdown";
import { BlockMath } from "react-katex";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { GraphBlock } from "@/components/blocks/graph-block";
import { GroupBlock } from "@/components/blocks/group-block";
import { renderDiagramTemplate } from "@/lib/rendering/diagram-templates";
import type { EditorBlock } from "@/lib/types/editor";
import { cn } from "@/lib/utils";

type BlockRendererProps = {
  block: EditorBlock;
  selected: boolean;
  onSelect: () => void;
};

function normalizeMathMarkdown(markdown: string) {
  return markdown
    .replace(/`(\$[^`]+\$)`/g, "$1")
    .replace(/\\\((.+?)\\\)/g, "$$$1$$")
    .replace(/\\\[([\s\S]+?)\\\]/g, (_, content: string) => `$$${content.trim()}$$`);
}

function alignmentClass(align: EditorBlock["style"]["align"]) {
  if (align === "center") {
    return "items-center";
  }

  if (align === "right") {
    return "items-end";
  }

  return "items-start";
}

function mathAlignmentClass(align: EditorBlock["style"]["align"]) {
  if (align === "center") {
    return "math-align-center";
  }

  if (align === "right") {
    return "math-align-right";
  }

  return "math-align-left";
}

export function BlockRenderer({ block, selected, onSelect }: BlockRendererProps) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden border bg-[var(--paper)] shadow-[0_10px_35px_rgba(25,28,24,0.08)]",
        selected ? "border-[var(--accent)] ring-2 ring-[rgba(217,95,51,0.18)]" : "border-[var(--panel-border)]",
      )}
      style={{
        backgroundColor: block.style.background,
        padding: block.style.padding,
        borderRadius: block.style.radius,
      }}
      onMouseDown={onSelect}
    >
      {block.showHeader ? (
        <div
          className="block-drag-handle mb-3 flex cursor-move items-start justify-between gap-3 border border-[#22312714] bg-white/70 px-3 py-2"
          style={{ borderRadius: Math.max(8, block.style.radius - 6) }}
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.26em] text-[#5d6c62]">{block.title}</div>
            <div className="mt-1 text-sm font-medium text-[#1a1e1b]">{block.subtitle}</div>
          </div>
          <div
            className="mt-1 h-3 w-3 rounded-full"
            style={{ backgroundColor: block.style.accent }}
          />
        </div>
      ) : (
        <button
          type="button"
          aria-label="Move block"
          className="block-drag-handle absolute right-2 top-2 z-10 h-5 w-5 cursor-move rounded-full border border-[#22312718] bg-white/80"
          style={{ boxShadow: "0 4px 14px rgba(25, 28, 24, 0.08)" }}
        />
      )}

      <div
        className="min-h-0 flex-1 overflow-auto text-[#1d231f]"
        style={{
          fontSize: `${block.style.fontSize}px`,
          lineHeight: block.style.lineHeight,
          textAlign: block.style.align,
        }}
      >
        {block.type === "text" ? (
          <div className="markdown-preview">
            <Markdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {normalizeMathMarkdown(block.content.markdown)}
            </Markdown>
          </div>
        ) : null}

        {block.type === "formula" ? (
          <div className={cn("flex h-full flex-col justify-center gap-4", alignmentClass(block.style.align))}>
            <div
              className={cn("w-full overflow-x-auto bg-white/70 px-4 py-5", mathAlignmentClass(block.style.align))}
              style={{
                borderRadius: Math.max(8, block.style.radius - 4),
                fontSize: `${block.style.fontSize * 1.2}px`,
              }}
            >
              <BlockMath math={block.content.latex} />
            </div>
            <p className="text-[#405047]">{block.content.note}</p>
          </div>
        ) : null}

        {block.type === "graph" ? (
          <GraphBlock
            expression={block.content.expression}
            caption={block.content.caption}
            radius={block.style.radius}
          />
        ) : null}

        {block.type === "callout" ? (
          <div className={cn("flex h-full flex-col gap-3", alignmentClass(block.style.align))}>
            <div
              className="inline-flex w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em]"
              style={{
                backgroundColor: `${block.style.accent}22`,
                color: block.style.accent,
              }}
            >
              {block.content.heading}
            </div>
            <p className="text-[#253128]">{block.content.body}</p>
          </div>
        ) : null}

        {block.type === "diagram" ? (
          <div className={cn("flex h-full flex-col gap-4", alignmentClass(block.style.align))}>
            <div
              className="w-full overflow-hidden border border-[#2231271c] bg-white/75"
              style={{ borderRadius: Math.max(8, block.style.radius - 4) }}
              dangerouslySetInnerHTML={{
                __html: renderDiagramTemplate(block.content.template),
              }}
            />
            <p className="text-[#405047]">{block.content.note}</p>
          </div>
        ) : null}

        {block.type === "group" ? <GroupBlock block={block} /> : null}
      </div>
    </article>
  );
}
