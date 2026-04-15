---
description: Orientación exhaustiva para desarrollo en Angular v20+. Úsala para crear o refactorizar aplicaciones en Modern Angular.
category: "🖥️ Desarrollo Web"
---

# Angular Expert (v20+)

## Purpose
Guide the development of high-performance, maintainable web applications using the latest Angular standards (v20+). Prioritize Signals for reactivity, Standalone Components for architecture, and Zoneless execution for performance.

## Instructions

### 1. Modern Architecture (Standalone & Modular)
- **Standalone Components**: Always use standalone components (`standalone: true`). Do not use NgModules unless strictly necessary for legacy integration.
- **Control Flow**: Use the new control flow syntax (`@if`, `@for`, `@switch`) instead of `*ngIf`/`*ngFor`.
- **Deferrable Views**: Utilize `@defer` for lazy loading parts of templates to optimize initial load.

### 2. Reactivity & State Management (Signals First)
- **Local State**: Use `signal()` and `computed()` for component-level state. Avoid `BehaviorSubject` for simple local state.
- **Inputs/Outputs**: Use Signal Inputs (`input()`, `input.required()`) and Signal Outputs (`output()`).
- **Global State**:
    - For simple apps: Signal-based services.
    - For complex apps: **NgRx** (Signal Store) or **RxAngular**.
- **RxJS**: Use RxJS mainly for complex async event streams, converting to Signals for template consumption (`toSignal`).

### 3. Performance (Zoneless)
- **Zoneless**: Aim for **Zoneless** applications (`provideExperimentalZonelessChangeDetection()`). Avoid `Zone.js` overhead.
- **OnPush**: Ensure all components use `ChangeDetectionStrategy.OnPush`.

### 4. Best Practices
- **Strict Typing**: Enforce strict TypeScript checks.
- **Dependency Injection**: Use `inject()` function instead of constructor injection.
- **SSR**: Design for Server-Side Rendering (Hydration) compatibility from the start.

## Resources
- **Migration**: When migrating from legacy Angular, follow the "Hybrid Mode" approach before going fully Zoneless.
