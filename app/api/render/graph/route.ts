import { NextResponse } from "next/server";

import { renderFallbackGraphSvg, renderGraphErrorSvg } from "@/lib/rendering/fallback-graph";

type GraphRequest = {
  expression?: string;
};

type GraphRenderResponse = {
  source: "python-engine" | "fallback";
  svg: string;
};

function fallback(expression: string) {
  try {
    return NextResponse.json<GraphRenderResponse>({
      source: "fallback",
      svg: renderFallbackGraphSvg({ expression }),
    });
  } catch (caughtError) {
    const message =
      caughtError instanceof Error ? caughtError.message : "Could not render this graph yet.";

    return NextResponse.json<GraphRenderResponse>({
      source: "fallback",
      svg: renderGraphErrorSvg(expression, message),
    });
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as GraphRequest;
  const expression = payload.expression?.trim() || "y = x^2";
  const engineUrl = process.env.PYTHON_ENGINE_URL ?? "http://127.0.0.1:8000";

  try {
    const response = await fetch(`${engineUrl}/render/graph`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expression }),
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) {
      return fallback(expression);
    }

    const body = (await response.json()) as { svg?: string };

    if (!body.svg) {
      return fallback(expression);
    }

    return NextResponse.json<GraphRenderResponse>({
      source: "python-engine",
      svg: body.svg,
    });
  } catch {
    return fallback(expression);
  }
}
