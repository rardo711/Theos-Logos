---
colors:
  primary:
    light: "#821111"
    dark: "#ef4444" # red-400 equivalent for accessibility
  background:
    base:
      light: "#ffffff"
      dark: "#0c0a09" # stone-950
    surface:
      light: "#fafaf9" # stone-50
      dark: "#1c1917" # stone-900
    glass:
      light: "rgba(255, 255, 255, 0.3)"
      dark: "rgba(12, 10, 9, 0.3)"
  text:
    heading:
      light: "#1c1917" # stone-900
      dark: "#fafaf9" # stone-50
    body:
      light: "#44403c" # stone-700
      dark: "#d6d3d1" # stone-300
    muted:
      light: "#a8a29e" # stone-400
      dark: "#57534e" # stone-600
  border:
    subtle:
      light: "rgba(231, 229, 228, 0.5)" # stone-200/50
      dark: "rgba(255, 255, 255, 0.1)" # white/10

typography:
  family:
    sans: "Inter, ui-sans-serif, system-ui, sans-serif"
    serif: "Playfair Display, ui-serif, Georgia, serif"
    mono: "JetBrains Mono, ui-monospace, monospace"
  size:
    ui:
      tiny: "9px"
      small: "12px"
      base: "16px"
      large: "18px"
      heading: "32px"
    reading:
      variable: "var(--reading-font-size, 18px)"
  weight:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700

elevation:
  shadows:
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    md: "0 8px 32px rgba(0, 0, 0, 0.08)"
    lg: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  glass:
    blur: "40px"
    saturation: "200%"

radii:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"

motion:
  duration:
    soft: "300ms"
    elegant: "500ms"
  easing:
    standard: "cubic-bezier(0.2, 0.8, 0.2, 1)"
---

# Theos Logos Design System

Theos Logos is a premium, scholarly mobile-first application designed for deep biblical study. The design identity balances the weight of ancient literature with the ethereal quality of modern, cutting-edge software.

## Philosophy

### The Glass & The Stone
The interface is built on a foundation of "Stone" (solidity, permanence) and "Glass" (clarity, light). 
- Surfaces use the **Stone** palette to provide a grounded, neutral canvas that respects the content.
- Interactive elements and overlays utilize **Atmospheric Glass** (high-saturation, high-blur glassmorphism) to create a sense of depth and focus without cluttering the visual hierarchy.

### Academic Precision
Typography is the heart of the experience. 
- **Playfair Display (Serif)** is used for headings and the scripture itself, evoking the feel of a high-quality physical book or manuscript.
- **Inter (Sans)** is used for UI actions and metadata, providing modern legibility.
- **JetBrains Mono** appears in verse numbers and timestamps, hinting at the analytical/data-driven side of theology.

### Scholarly Warmth
The brand color is a deep, scholarly **Oxblood Red** (#821111). It is used sparingly to denote importance, active states, and identity. This color choice deviates from standard tech blues or purples, instead leaning into the colors of traditional bookbinding and historical ink.

## Visual Language

### Elevation & Effects
- **Floating Controls**: Navigation and settings are housed in "Floating Pills" (full radius) that appear to hover over the content.
- **Micro-Texture**: An extremely subtle SVG grain/noise overlay is applied globally. This breaks the "digital flatness" and gives the UI a tactile, paper-like sub-texture.
- **Resizing Controls**: The study workspace is fluid. Resizers use minimal vertical pills that expand on interaction, maintaining a tool-like aesthetic.

### Interaction
- **Nav Visibility**: The bottom navigation is reactive. It hides on scroll-down to maximize reading space and reappears on scroll-up with a smooth, scale-up entrance.
- **Staggered Entrance**: Content transitions use Spring physics with high damping, ensuring the app feels "alive" but controlled and sophisticated.

## Responsive Strategy
- **Mobile/Vertical Orientation**: Optimized for one-handed reading. The floating pill is kept within thumb range.
- **Desktop/Side-by-Side**: Transitions from an "either-or" view to a multi-pane workspace. The commentary panel on desktop is resizable, acknowledging that different users have different "comfort widths" for analytical reading.
