# Back to Top Button with Progress Ring

## Overview
A floating circular button that appears when users scroll down the page, showing a progress ring that indicates how far down the page they've scrolled. When clicked, it smoothly scrolls back to the top of the page.

## Features

✅ **Auto-appear on scroll** - Button appears after scrolling 300px (customizable)  
✅ **Progress ring indicator** - SVG circle fills as users scroll down  
✅ **Smooth scroll-to-top** - Uses the SmoothScroll utility for elegant animation  
✅ **Responsive design** - Adjusts size and position for mobile devices  
✅ **Hover effects** - Lifts up and pulses on hover  
✅ **Accessible** - ARIA labels and keyboard navigation support  
✅ **Performance optimized** - Uses passive scroll event listener  

## How It Works

### Scroll Detection
- Listens to window scroll events (passive mode for performance)
- Shows button when scrollTop > threshold (default: 300px)
- Calculates scroll progress: `(scrollTop / totalScrollableHeight) * 100`

### Progress Ring
- Uses SVG with two circles (background and progress)
- Progress circle stroke-dashoffset dynamically updated
- Rotated -90° to start from top
- Smooth CSS transitions for updates

### Smooth Scroll
- Uses the `useSmoothScroll` hook
- Calls `scrollToTop()` for elegant upward animation

## Usage

The component is automatically included in `App.js` and appears on all pages.

### Customizing Threshold

Change the scroll threshold distance to show the button:

```jsx
<BackToTop threshold={500} /> // Show after scrolling 500px
```

### Positioning

The button is positioned using CSS. To adjust position, edit `BackToTop.css`:

```css
.back-to-top {
    bottom: 2rem;  /* Distance from bottom */
    right: 2rem;   /* Distance from right */
}
```

### Sizing

Adjust button size in `BackToTop.css`:

```css
.back-to-top {
    width: 56px;
    height: 56px;
}
```

**For mobile:**
```css
@media (max-width: 768px) {
    .back-to-top {
        width: 48px;
        height: 48px;
    }
}
```

### Colors

Customize colors to match your theme:

```css
.back-to-top {
    background: var(--background-white); /* Button background */
    color: var(--primary-color);          /* Arrow color */
}

.progress-ring-circle-bg {
    stroke: #ff9f7c;  /* Background ring color */
}

.progress-ring-circle {
    stroke: #ff6b35;  /* Progress ring color */
}
```

### Progress Circle Radius

Adjust size of the progress ring:

```jsx
// In BackToTop.js
const radius = 24;  // Increase/decrease to change ring size
```

### Animation Speeds

**Progress ring update:**
```css
.back-to-top circle {
    transition: stroke-dashoffset 0.15s ease-out; /* Faster/slower */
}
```

**Entry animation:**
```css
@keyframes slideUp {
    /* Change 0.4s for different speed */
}
```

## Integration Notes

- **File:** `src/Components/BackToTop.js`
- **Styles:** `src/Components/BackToTop.css`
- **Imported in:** `src/App.js`
- **Dependencies:** `useSmoothScroll` from `SmoothScroll.js`

## Browser Support

✅ All modern browsers (Chrome, Firefox, Safari, Edge)  
✅ Mobile browsers (iOS Safari, Chrome Mobile)  
⚠️ IE11 - Limited support (no passive events)  

## Performance

- Uses **passive scroll event listener** - minimal performance impact
- **SVG rendering** - crisp on all displays (Retina support)
- **CSS transitions** - hardware accelerated
- **Component re-rendering** - only when opacity changes (show/hide)

## Accessibility

- **ARIA label:** `aria-label="Back to top"`
- **Title tooltip:** `title="Back to top"`
- **Keyboard accessible:** Can be focused and activated with Enter/Space
- **Focus outline:** Visible when keyboard focused

## Custom Examples

### Different Position (Bottom Left)

```jsx
// Modify BackToTop.css
.back-to-top {
    right: auto;
    left: 2rem;
}
```

### Square Button

```jsx
// Modify BackToTop.css
.back-to-top {
    border-radius: 8px;  /* Square with rounded corners */
}
```

### Without Progress Ring

```jsx
// Modify BackToTop.js
// Remove the SVG and return just the arrow
return (
    <button 
        className="back-to-top simple" 
        onClick={handleClick}
        aria-label="Back to top"
    >
        <span className="back-to-top-arrow">↑</span>
    </button>
);
```

```css
/* Add to BackToTop.css */
.back-to-top.simple {
    width: 48px;
    height: 48px;
}

.back-to-top.simple .progress-ring {
    display: none;
}
```

## Troubleshooting

### Button not appearing
- Check if you've scrolled past the threshold (default 300px)\- Verify console for JavaScript errors
- Ensure component is imported correctly in App.js

### Progress ring not updating
- Check if passive scroll events are supported in your browser
- Verify SVG element dimensions are correct
- Check for CSS conflicts

### Button showing on scroll on specific pages
- Check page height (must be taller than window height)
- Verify scroll calculation works for that page
- Some pages may have fixed positioning that affects calculations

## Tips

1. **Threshold tuning:** Lower threshold (100-200px) for shorter pages, higher (400-500px) for longer pages
2. **Mobile optimization:** Decrease button size and position further from edges on mobile
3. **Color contrast:** Ensure progress ring is visible against your page background
4. **Performance:** Keep threshold reasonable - showing button too early can distract

## Credits

Built with React, SVG, and vanilla JavaScript for optimal performance.