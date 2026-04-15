---
description: Inteligencia de diseño para UI/UX profesional. Úsalo al crear componentes web o dashboards para asegurar una estética de alta fidelidad.
category: "🎨 Diseño & UI"
---

# UI/UX Pro Max

## Purpose
Transform natural language descriptions into polished, responsive user interfaces with professional design intelligence. Focus on modern aesthetics (Glassmorphism, Brutalism, Bento Grid), accessibility, and best practices.

## Instructions

### 1. Planning Phase (Before Coding)
- **Clarify Expectations**: Ask the user for their preferred visual style (e.g., Default, Minimalist, Glassmorphism, Brutalism) and target audience.
- **Identify Components**: Break down the UI into reusable components.

### 2. Implementation Defaults
Unless specified otherwise, use the following stack:
- **Framework**: React (Next.js) or compiled HTML/CSS.
- **Component Library**: **shadcn/ui** is the preferred choice for React.
- **Styling**: **Tailwind CSS**.

### 3. Design System Rules
- **Typography**:
    - **Body**: Inter, Roboto, or system sans-serif.
    - **Headings**: Montserrat, Playfair Display, or tight sans-serif (e.g., Geist).
- **Accessibility**:
    - Enforce WCAG 2.1 AA contrast ratios (minimum 4.5:1 for normal text).
    - Use semantic HTML and ARIA labels where necessary.
- **Spacing**: Use consistent spacing scales (Tailwind `p-4`, `m-2`, etc.).

### 4. Interactive Commands
- **`/design`**: Generate a high-fidelity mockup description or code.
- **`/review`**: Audit an existing UI for UX flaws, accessibility issues, and aesthetic improvements.
- **`/fix`**: Automatically correct responsive design issues or accessibility violations.

## Constraints
- **Do not use placeholder images**: Use `generate_image` or solid colors/gradients.
- **Do not use raw CSS** if Tailwind is available.
- **Ensure Responsiveness**: Mobile-first approach.
