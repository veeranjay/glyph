"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { renderFallbackGraphSvg, renderGraphErrorSvg } from "@/lib/rendering/fallback-graph";

type GraphBlockProps = {
  expression: string;
  caption: string;
};

type GraphResponse = {
  source: "python-engine" | "fallback";
  svg: string;
};

export function GraphBlock({ expression, caption }: GraphBlockProps) {
  const deferredExpression = useDeferredValue(expression);
  const localRender = useMemo(() => {
    try {
      return {
        error: null,
        svg: renderFallbackGraphSvg({ expression: deferredExpression }),
      };
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Could not render this graph yet.";

      return {
        error: message,
        svg: renderGraphErrorSvg(deferredExpression, message),
      };
    }
  }, [deferredExpression]);

  const [remoteGraph, setRemoteGraph] = useState<{
    error: string | null;
    expression: string;
    source: GraphResponse["source"];
    svg: string;
  } | null>(null);

  const activeRemoteGraph =
    remoteGraph?.expression === deferredExpression ? remoteGraph : null;
  const displaySvg = activeRemoteGraph?.svg ?? localRender.svg;
  const displaySource = activeRemoteGraph?.source ?? "fallback";
  const displayError = activeRemoteGraph?.error ?? localRender.error;

  useEffect(() => {
    if (typeof window.fetch !== "function") {
      return undefined;
    }

    const controller = new AbortController();

    async function renderGraph() {
      try {
        const response = await fetch("/api/render/graph", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ expression: deferredExpression }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Graph render request failed.");
        }

        const payload = (await response.json()) as GraphResponse;

        if (!controller.signal.aborted) {
          setRemoteGraph({
            error: null,
            expression: deferredExpression,
            source: payload.source,
            svg: payload.svg || localRender.svg,
          });
        }
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setRemoteGraph({
            error: caughtError instanceof Error ? caughtError.message : "Graph render failed.",
            expression: deferredExpression,
            source: "fallback",
            svg: localRender.svg,
          });
        }
      }
    }

    void renderGraph();

    return () => controller.abort();
  }, [deferredExpression, localRender.error, localRender.svg]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.24em] text-[#5d6c62]">
        <span>{displaySource === "python-engine" ? "Python render" : "Fallback SVG"}</span>
        {displayError ? <span>Local render</span> : null}
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[18px] border border-[#2231271c] bg-[#fffdfa]">
        {displaySvg ? (
          <div
            className="h-full w-full"
            dangerouslySetInnerHTML={{ __html: displaySvg }}
          />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm text-[#5d6c62]">
            {displayError ?? "Waiting for graph data..."}
          </div>
        )}
      </div>

      <p className="text-[12px] leading-5 text-[#405047]">{caption}</p>
    </div>
  );
}
