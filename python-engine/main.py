from math import cos, exp, log, sin, sqrt, tan
from typing import List, Tuple

from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI(title="Vision Python Engine", version="0.1.0")


class GraphRequest(BaseModel):
    expression: str


def normalize_expression(expression: str) -> str:
    normalized = expression.strip()

    if normalized.lower().startswith("y="):
        normalized = normalized[2:]

    if normalized.lower().startswith("f(x)="):
        normalized = normalized[5:]

    normalized = normalized.replace("^", "**")
    normalized = normalized.replace(")(", ")*(")
    normalized = normalized.replace(")x", ")*x")

    for number in "0123456789":
        normalized = normalized.replace(f"{number}x", f"{number}*x")
        normalized = normalized.replace(f"{number}(", f"{number}*(")

    return normalized


def sample_expression(expression: str) -> List[Tuple[float, float]]:
    sanitized = normalize_expression(expression)
    points: List[Tuple[float, float]] = []
    safe_locals = {
        "sin": sin,
        "cos": cos,
        "tan": tan,
        "sqrt": sqrt,
        "log": log,
        "exp": exp,
        "abs": abs,
    }

    for index in range(121):
        x = -10 + (20 / 120) * index

        try:
            y = float(eval(sanitized, {"__builtins__": {}}, {"x": x, **safe_locals}))
        except Exception:
            continue

        if y != y or y < -40 or y > 40:
            continue

        points.append((x, y))

    if not points:
        raise ValueError("No valid points produced for expression.")

    return points


def project(value: float, minimum: float, maximum: float, size: float) -> float:
    return ((value - minimum) / (maximum - minimum)) * size


def build_graph_svg(expression: str) -> str:
    width = 360
    height = 220
    points = sample_expression(expression)
    polyline = " ".join(
        f"{project(x, -10, 10, width):.2f},{height - project(y, -10, 10, height):.2f}"
        for x, y in points
    )
    axis_x = height - project(0, -10, 10, height)
    axis_y = project(0, -10, 10, width)

    return f"""
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" fill="none" role="img" aria-label="Graph of {expression}">
      <rect width="{width}" height="{height}" rx="18" fill="#fffdfa" />
      <line x1="0" y1="{axis_x}" x2="{width}" y2="{axis_x}" stroke="#233228" stroke-width="1.4" />
      <line x1="{axis_y}" y1="0" x2="{axis_y}" y2="{height}" stroke="#233228" stroke-width="1.4" />
      <polyline
        points="{polyline}"
        stroke="#d95f33"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <text x="{width - 18}" y="18" text-anchor="end" fill="#5d6c62" font-size="12" font-family="IBM Plex Mono, monospace">{expression}</text>
    </svg>
    """.strip()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/render/graph")
def render_graph(payload: GraphRequest) -> dict[str, str]:
    return {"svg": build_graph_svg(payload.expression)}


@app.post("/render/formula")
def render_formula(payload: GraphRequest) -> dict[str, str]:
    return {
        "svg": f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 120'><text x='20' y='64' font-size='28' fill='#1a1e1b'>{payload.expression}</text></svg>"
    }


@app.post("/render/diagram")
def render_diagram(payload: GraphRequest) -> dict[str, str]:
    return {
        "svg": f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 200'><rect width='320' height='200' rx='20' fill='#fffdfa'/><text x='24' y='48' font-size='18' fill='#1a1e1b'>Diagram engine stub</text><text x='24' y='84' font-size='14' fill='#5d6c62'>{payload.expression}</text></svg>"
    }
