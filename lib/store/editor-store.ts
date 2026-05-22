"use client";

import { create } from "zustand";

import { createBlock, createGroupItem, createInitialBlocks } from "@/lib/editor/factory";
import type {
  BlockLayout,
  BlockStyle,
  BlockType,
  EditorBlock,
  GroupBlock,
  GroupItemType,
} from "@/lib/types/editor";

type EditorStore = {
  blocks: EditorBlock[];
  selectedBlockId: string | null;
  addBlock: (type: BlockType) => void;
  selectBlock: (id: string | null) => void;
  updateLayouts: (layouts: BlockLayout[]) => void;
  updateStyle: (id: string, patch: Partial<BlockStyle>) => void;
  updateHeaderVisibility: (id: string, showHeader: boolean) => void;
  updateMeta: (id: string, patch: Partial<Pick<EditorBlock, "title" | "subtitle">>) => void;
  updateContent: (id: string, patch: Record<string, string>) => void;
  addGroupItem: (groupId: string, type: GroupItemType) => void;
  updateGroupItem: (
    groupId: string,
    itemId: string,
    patch: Partial<Pick<GroupBlock["content"]["items"][number], "title" | "body">>,
  ) => void;
  updateGroupLayouts: (groupId: string, layouts: BlockLayout[]) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  blocks: createInitialBlocks(),
  selectedBlockId: "text-1",
  addBlock: (type) =>
    set((state) => {
      const nextIndex = state.blocks.length + 1;
      const block = createBlock(type, nextIndex);

      return {
        blocks: [...state.blocks, block],
        selectedBlockId: block.id,
      };
    }),
  selectBlock: (id) => set({ selectedBlockId: id }),
  updateLayouts: (layouts) =>
    set((state) => ({
      blocks: state.blocks.map((block) => {
        const nextLayout = layouts.find((layout) => layout.i === block.id);

        return nextLayout ? { ...block, layout: { ...block.layout, ...nextLayout } } : block;
      }),
    })),
  updateStyle: (id, patch) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, style: { ...block.style, ...patch } } : block,
      ),
    })),
  updateHeaderVisibility: (id, showHeader) =>
    set((state) => ({
      blocks: state.blocks.map((block) =>
        block.id === id ? { ...block, showHeader } : block,
      ),
    })),
  updateMeta: (id, patch) =>
    set((state) => ({
      blocks: state.blocks.map((block) => (block.id === id ? { ...block, ...patch } : block)),
    })),
  updateContent: (id, patch) =>
    set((state) => {
      const blocks = state.blocks.map((block) => {
        if (block.id !== id) {
          return block;
        }

        return {
          ...block,
          content: {
            ...block.content,
            ...patch,
          },
        } as EditorBlock;
      });

      return { blocks };
    }),
  addGroupItem: (groupId, type) =>
    set((state) => ({
      blocks: state.blocks.map((block) => {
        if (block.id !== groupId || block.type !== "group") {
          return block;
        }

        const nextItem = createGroupItem(type, block.content.items.length + 1);

        return {
          ...block,
          content: {
            ...block.content,
            items: [...block.content.items, nextItem],
          },
        };
      }),
    })),
  updateGroupItem: (groupId, itemId, patch) =>
    set((state) => ({
      blocks: state.blocks.map((block) => {
        if (block.id !== groupId || block.type !== "group") {
          return block;
        }

        return {
          ...block,
          content: {
            ...block.content,
            items: block.content.items.map((item) =>
              item.id === itemId ? { ...item, ...patch } : item,
            ),
          },
        };
      }),
    })),
  updateGroupLayouts: (groupId, layouts) =>
    set((state) => ({
      blocks: state.blocks.map((block) => {
        if (block.id !== groupId || block.type !== "group") {
          return block;
        }

        return {
          ...block,
          content: {
            ...block.content,
            items: block.content.items.map((item) => {
              const nextLayout = layouts.find((layout) => layout.i === item.id);

              return nextLayout ? { ...item, layout: { ...item.layout, ...nextLayout } } : item;
            }),
          },
        };
      }),
    })),
}));
