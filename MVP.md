Core Use Cases
1. Notes

Structured study notes.

2. Ultra-Dense Revision Sheets

Compact A4 summaries with:

formulas
graphs
intuition snippets
derivations
diagrams
shortcuts
3. Visual Concept Papers

Math/physics concepts explained visually.

This is enough for an MVP.

Simplified Architecture
Frontend
Stack
Next.js
TypeScript
Tailwind
Zustand

That’s it.

Editor Architecture
IMPORTANT:

Do NOT build a freeform editor first.

Build:

a block-grid editor

Much simpler.

How the Page Works

The A4 page is:

fixed dimensions
CSS grid based
resizable blocks

Think:

12-column printable grid

Users:

drag blocks
resize blocks
edit content

This avoids:

canvas complexity
coordinate systems
zoom engines
infinite layouts
Recommended Layout System

Use:

react-grid-layout

react-grid-layout

This is PERFECT for your MVP.

Why:

draggable
resizable
grid-based
stable
printable
React-native workflow
CRITICAL DECISION:
Use SVG Instead of Manim Initially

This is extremely important.

You said:

“visualization diagrams are a MUST”

Correct.

But:

Manim is NOT the right first rendering engine.

Why?

Manim:

slow
render-heavy
video-oriented
infrastructure-heavy
asynchronous
painful for live editing

For MVP:
you want:

instant
editable
lightweight
exportable
printable visuals

That means:

SVG-first rendering.
MUCH BETTER MVP VISUAL STACK
Use Python for:
symbolic math
graph generation
geometry generation

But output:

SVG

NOT videos.

Python Visualization Engine

Use:

SymPy
Matplotlib
Plotly
svgwrite
CairoSVG

This is FAR easier.

Example Flow

User enters:

f(x)=x^2

Python generates:

graph SVG
axis SVG
tangent SVG
annotations

Frontend embeds SVG directly.

Fast.
Clean.
Printable.

When to Use Manim

ONLY later for:

animated derivations
transformation sequences
educational exports

Not live editing.

Recommended Block Types (MVP)

Keep this TINY.

1. Text Block

Supports:

markdown
headings
lists
inline LaTeX
2. Formula Block

Centered equations.

Example:

E=mc
2

3. Graph Block

Input:

y=x^2

Output:
SVG graph.

4. Diagram Block

For:

geometry
vectors
optics
mechanics

Generated via Python.

5. Callout/Insight Block

For:

heuristics
traps
intuitions
analogies

This matches your “qualitative analysis sheet”.

Recommended Editor Structure
LEFT SIDEBAR

Block palette:

text
formula
graph
diagram
image
callout
CENTER

A4 paper preview.

RIGHT SIDEBAR

Properties:

typography
spacing
colors
rendering
alignment
A4 Rendering Strategy

VERY IMPORTANT.

Do NOT fake A4.

Use:

width: 794px;
height: 1123px;

(96dpi A4 approximation)

Everything becomes easier:

exports
printing
layout consistency
Export Strategy

Use:

html2pdf

OR

Puppeteer PDF rendering

Much easier than LaTeX compilation.

Recommended Text Editor

Use:

Lexical

Lexical

Why:

modular
modern
performant
React-native
custom nodes easy

You NEED:

inline LaTeX nodes
theorem blocks
syntax highlighting

Lexical is ideal.

Simplified Backend

You barely need one initially.

Initial Backend
Next.js API routes only

Use:

SQLite locally
Prisma ORM

Done.

File Structure Recommendation
/app
/components
  /editor
  /blocks
  /layout
/lib
  /rendering
  /latex
  /export
/python-engine
Python Engine

Keep it isolated.

Use:

FastAPI

Endpoints:

/render/graph
/render/diagram
/render/formula
Example Architecture
Next.js Frontend
      |
      v
FastAPI Math Engine
      |
      +--> SymPy
      +--> Matplotlib
      +--> SVG output

That’s enough.

BEST FEATURE YOU SHOULD PRIORITIZE

Not AI.

Not collaboration.

Not databases.

PRIORITIZE:
“Density-aware layout editing”

Because your product is fundamentally about:

maximizing information density without becoming unreadable

That is your niche.

Features That Matter MOST
1. Smart Alignment

Blocks snap beautifully.

2. Typography Controls

Extremely important.

Need:

compact spacing
line-height tuning
formula scaling
column layouts
3. Nested Layouts

Allow:

A4
 └── section
      └── mini-grid

This is HUGE for dense summaries.

4. Formula-Aware Resizing

Block auto-expands based on equation complexity.

5. Visual Diagram Templates

THIS is your differentiator.

Examples:

coordinate plane
free body diagram
circuit diagram
ray optics
vectors
transformations