---
name: Glassmorphism Design Pattern
description: How all Expo screens in اكسير are styled — gradient headers, glass elements, shadow cards.
---

## Header gradient (every screen)
```jsx
import { LinearGradient } from "expo-linear-gradient";

<LinearGradient
  colors={["#001E3C", "#003F6D", "#0A5FA0"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.header}
>
  <View style={styles.headerOrb1} pointerEvents="none" />
  <View style={styles.headerOrb2} pointerEvents="none" />
  {/* content */}
</LinearGradient>
```

## Orb sizes (standard)
- Orb 1: `{ top: -50, right: -50, width: 160, h: 160, borderRadius: 80, bg: "rgba(37,156,244,0.2)" }`
- Orb 2: `{ bottom: -20, left: -30, width: 110, h: 110, borderRadius: 55, bg: "rgba(29,208,248,0.13)" }`

## Glass elements inside dark header
- Background: `rgba(255,255,255,0.12)`
- Border: `rgba(255,255,255,0.22)`

## Filter chips / tabs inside dark header
- Selected: `backgroundColor: "rgba(255,255,255,0.95)"`, `borderColor: "#FFF"`, text: `colors.dark`
- Unselected: `backgroundColor: "rgba(255,255,255,0.12)"`, `borderColor: "rgba(255,255,255,0.28)"`, text: `rgba(255,255,255,0.9)`

## Content-area cards (on light background)
```js
shadowColor: "#003F6D",
shadowOffset: { width: 0, height: 3 },
shadowOpacity: 0.08,
shadowRadius: 12,
elevation: 4,
// No borderWidth — replaced by shadow
```

## Colors background
`#EEF4FD` (cool blue-tinted white) — set in `constants/colors.ts`

**Why:** Consistent glass/gradient language across all screens; removes jarring flat dark headers; shadow cards instead of flat border cards for depth.
**How to apply:** Every new screen should follow the header pattern. Import LinearGradient, add two orb Views with pointerEvents="none", no backgroundColor on header style (uses overflow:hidden instead).
