# Vision

An MVP-grade study-sheet editor focused on dense, printable A4 layouts for notes, formulas, graphs, callouts, and visual concept blocks.

## Current Slice

- Next.js + TypeScript + Tailwind app shell
- A fixed A4, 12-column `react-grid-layout` editor
- Zustand-backed block state and block inspector
- Text, formula, graph, callout, and diagram blocks
- SVG graph rendering through a lightweight API contract
- FastAPI scaffold for a dedicated Python rendering engine

## Run The Frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Optional Python Engine

The graph API route falls back to local SVG generation if the Python engine is offline, so the editor still works without it.

```bash
cd python-engine
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Set `PYTHON_ENGINE_URL` if you want the Next.js route to point somewhere other than `http://127.0.0.1:8000`.

## Next Priorities

- Rich text editing with Lexical instead of textarea-driven content editing
- Nested section grids for ultra-dense revision sheets
- Export to PDF and print presets
- Real symbolic / geometry rendering in the Python engine
