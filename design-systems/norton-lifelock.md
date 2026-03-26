# Norton / LifeLock Design System

Source: [Norton - LifeLock Web Kit (Figma)](https://www.figma.com/design/6rlbqHIy52OXmyyPH4TRMs/Norton---LifeLock-Web-Kit_AUG-2024--Copy-)

---

## Typography

**Font Family:** Inter (Google Font)
**Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700), ExtraBold (800)

### Headings (Inter ExtraBold, Bold optional)

| Token       | Desktop         | Mobile          | Line Height | Char Spacing | Margin  |
| ----------- | --------------- | --------------- | ----------- | ------------ | ------- |
| Title XL    | 72px ExtraBold  | 44px ExtraBold  | 84px / 56px | -0.3px       | 76px / 40px |
| Title 1     | 64px ExtraBold  | 36px ExtraBold  | 68px / 46px | -0.3px       | 60px / 40px |
| Title 2     | 52px ExtraBold  | 32px ExtraBold  | 64px / 40px | -0.3px       | 40px    |
| Title 3     | 44px ExtraBold  | 28px ExtraBold  | 56px / 38px | -0.3px       | 40px / 32px |
| Title 4     | 36px ExtraBold  | 24px ExtraBold  | 48px / 34px | -0.3px       | 40px / 26px |
| Title 5     | 28px ExtraBold  | 20px ExtraBold  | 40px / 30px | -0.3px       | 32px    |
| Title 6     | 24px ExtraBold  | —               | —           | -0.3px       | —       |

### Body Copy (Inter Medium)

| Token      | Size  | Line Height | Char Spacing | Margin  |
| ---------- | ----- | ----------- | ------------ | ------- |
| Body Large | 24px  | 36px        | -0.3px       | 20px    |
| Body       | 20px  | 32px        | -0.3px       | 24px    |
| Body Small | 18px  | 28px        | -0.3px       | 24px    |
| Body XS    | 16px  | 24px        | -0.3px       | 24px    |
| Body XXS   | 14px  | 22px        | -0.3px       | —       |
| Caption    | 13px  | 18px        | -0.3px       | —       |
| Micro      | 11px  | 16px        | -0.3px       | —       |

### Font Colors

| Token   | Hex       | Usage                    |
| ------- | --------- | ------------------------ |
| Gray 01 | `#242424` | Primary text (dark bg)   |
| Gray 02 | `#555551` | Secondary text           |
| Blue 01 | `#0F71F0` | Link / accent text       |
| Red 02  | `#D40404` | Error / alert text       |

---

## Colors

### Primary Palette

| Name      | Hex       | Usage                              |
| --------- | --------- | ---------------------------------- |
| Yellow 01 | `#FEEB29` | Primary brand / CTA background     |
| Gray 01   | `#242424` | Primary text, dark backgrounds     |
| Gray 02   | `#555551` | Secondary text                     |
| Gray 05   | `#F4F1ED` | Light background / card bg         |
| White 01  | `#FFFFFF` | White background                   |

### Secondary Palette

| Name      | Hex       | Usage                     |
| --------- | --------- | ------------------------- |
| Blue 01   | `#0F71F0` | Links, interactive accent |
| Blue 02   | `#3F8DF3` | Hover / lighter blue      |
| Blue 03   | `#87B8F7` | Light blue accent         |
| Blue 04   | `#CFE3FC` | Lightest blue tint        |
| Salmon 01 | `#F48162` | Warm accent               |
| Salmon 02 | `#FF9176` | Lighter salmon            |
| Salmon 03 | `#FFBAA9` | Light salmon tint         |
| Salmon 04 | `#FFE4DD` | Lightest salmon           |
| Plum 01   | `#6A233F` | Deep accent               |
| Plum 02   | `#9E677D` | Mid plum                  |
| Plum 03   | `#C3A1AF` | Light plum                |
| Plum 04   | `#E1D3D9` | Lightest plum             |
| Teal 01   | `#108389` | Cool accent               |
| Teal 02   | `#3396A1` | Mid teal                  |
| Teal 03   | `#80BDC4` | Light teal                |
| Teal 04   | `#CCE5E7` | Lightest teal             |
| Green 04  | `#D2E9CA` | Success tint bg           |
| Yellow 02 | `#FBEECA` | Yellow tint bg            |
| Yellow 03 | `#FDF6E4` | Lightest yellow tint      |

### Functional Colors

| Name     | Hex       | Usage              |
| -------- | --------- | ------------------ |
| Blue 00  | `#125CC5` | Focus ring / deep  |
| Green 01 | `#007644` | Success            |
| Green 02 | `#16A761` | Success accent     |
| Green 03 | `#C1EAD8` | Success bg tint    |
| Red 01   | `#AA0000` | Error / danger     |
| Red 02   | `#D40404` | Error text         |
| Red 03   | `#F4D5D5` | Error bg tint      |
| Gray 03  | `#C1BFB8` | Disabled / border  |
| Gray 04  | `#DDDBD9` | Light border       |

---

## Buttons

### Signature Treatment
- All buttons are **fully rounded on the ends** (pill shape) — `border-radius: 9999px`
- Use **Inter ExtraBold** for button text
- Character spacing: **-0.3px**

### Sizes

| Size     | Height | Font Size  | Padding (L/R) | Corner Radius |
| -------- | ------ | ---------- | -------------- | ------------- |
| Standard | 56px   | 18px / 26px | min 24px       | 24px (pill)   |
| Medium   | 44px   | 18px / 24px | min 20px       | 22px (pill)   |
| Small    | 36px   | 14px / 20px | min 14px       | 18px (pill)   |
| XL       | 64px   | 20px / 32px | min 28px       | 32px (pill)   |

### Primary CTA (Light BG)

| State    | Background | Border              | Text Color |
| -------- | ---------- | ------------------- | ---------- |
| Default  | `#FEEB29`  | 3px `#242424`       | `#242424`  |
| Hover    | `#FFF488`  | 3px `#242424`       | `#242424`  |
| Active   | `#FFFBC9`  | 3px `#242424`       | `#242424`  |
| Focus    | `#FEEB29`  | 3px `#0F71F0`       | `#242424`  |
| Disabled | `#F4F1ED`  | 3px `#C1BFB8`       | `#C1BFB8`  |

### Secondary CTA (Light BG)

| State    | Background | Border              | Text Color |
| -------- | ---------- | ------------------- | ---------- |
| Default  | `#FFFFFF`  | 3px `#242424`       | `#242424`  |
| Hover    | `#242424`  | 3px `#242424`       | `#FFFFFF`  |
| Active   | `#242424`  | 3px `#242424`       | `#242424`  |
| Focus    | `#FFFFFF`  | 4px `#0F71F0`       | `#242424`  |
| Disabled | `#F4F1ED`  | 3px `#C1BFB8`       | `#C1BFB8`  |

---

## Signature Design Treatments

### Rounded Corners
- **Containers:** equally rounded corners, 20–30px
- **Buttons:** fully rounded on ends (pill) for CTAs
- **Images:** Desktop/Tablet 20px, Mobile 16px corner radius

### Stroke
- All buttons should have a **bold stroke** (3px) for visual distinction
- Hover states on interactive elements can use an **outline stroke** (1–3px)

### Oversized Elements
- Use **larger padding** around elements to add emphasis
- Use **bolder font weights** of the type family for oversized effect

---

## Spacing

### Spacing Scale

| Token       | Desktop | Mobile | Usage                     |
| ----------- | ------- | ------ | ------------------------- |
| Module      | 90px    | 50px   | Module padding (top/bottom) |
| Section     | 70px    | 40px   | Headline to content        |
| Content     | 50px    | 30px   | Between content blocks     |
| Element     | 40px    | 20px   | Icon to caption            |
| Sub-element | 30px    | 15px   | Caption to paragraphs      |
| Tight       | 20px    | 10px   | Compact spacing            |
| Micro       | 15px    | —      | Fine adjustments           |
| Nano        | 10px    | —      | Smallest spacing           |

**Rule:** When using larger weighted elements together, skip a spacing level for balance.

### Grid

| Breakpoint  | Width Range | Container | Columns | Gutter |
| ----------- | ----------- | --------- | ------- | ------ |
| Desktop Max | 1022px+     | 1300px    | 12      | 20px   |
| Desktop Min | 1022px+     | 992px     | 12      | 20px   |
| Tablet      | 768–1021px  | 728px     | 12      | 5px    |
| Mobile      | 375–767px   | 345px     | 12      | 5px    |

---

## Image Guidance

### Photography Principles
- Bring in color through imagery
- Add impact through contrast & saturation
- Choose colors that are **"yellow compatible"**
- Add liveliness through movement (video, gif, live photo)

### Image Corners
- **Desktop/Tablet:** 20px border-radius
- **Mobile:** 16px border-radius

### Full Bleed Banners
- If image doesn't fill the module, use a gradient to blend background color
- Use dark or light gradient overlays for text legibility

---

## Quiz-Specific Application

When applying this design system to the quiz tool:

### Card / Container
- Background: `#F4F1ED` (Gray 05) or `#FFFFFF`
- Border-radius: 20px
- Padding: 40–50px desktop, 24–30px mobile

### Answer Buttons
- Style: pill shape, 3px `#242424` border
- Font: Inter ExtraBold, 18px
- Height: 56px (standard) or 44px (medium)
- Default bg: `#FFFFFF`, text: `#242424`
- Hover bg: `#242424`, text: `#FFFFFF` (invert)
- Active: `scale(0.97)` press feedback

### Primary CTA (Next / See Results)
- Background: `#FEEB29` (Yellow 01)
- Border: 3px solid `#242424`
- Text: `#242424`, Inter ExtraBold
- Hover: `#FFF488`
- Pill shape, 56px height

### Result Cards
- Correct: light `#D2E9CA` (Green 04) bg with `#007644` (Green 01) text accent
- Incorrect: light `#F4D5D5` (Red 03) bg with `#AA0000` (Red 01) text accent

### Score Badge
- Background: `#FEEB29` (Yellow 01) at 15% opacity
- Text: `#242424` (Gray 01)
- Border-radius: 12px

### Theme Switcher / Page Background
- Background: `#F4F1ED` (Gray 05)
- Text color: `#242424` (Gray 01)
- Accent: `#FEEB29` (Yellow 01)
