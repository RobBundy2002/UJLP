# PDF Viewer Component

## Overview
A beautiful, responsive PDF viewer that displays PDFs inline on desktop with a professional document-style layout, while maintaining the "Open PDF" button for mobile users.

## Features

✅ **Desktop-only display** - Shows beautiful embedded PDF on desktop, falls back to button on mobile  
✅ **Professional header** - Gradient header with title, author, and download button  
✅ **Document-style frame** - Clean borders, shadows, and rounded corners  
✅ **Download functionality** - Quick download button in header  
✅ **Responsive sizing** - Constrained to optimal viewing dimensions  
✅ **Fallback handling** - Graceful degradation if PDF can't be embedded  
✅ **User hints** - Helpful footer with tips for using PDF viewer  

## Desktop Experience

### What Users See:
```
┌─────────────────────────────────────────┐
│ 📄 Article Title                ⬇️ Download │  Gradient header
│    By Author Name                          │
├─────────────────────────────────────────┤
│                                           │
│         [Embedded PDF Viewer]            │  Actual PDF displayed
│         with browser controls            │  No scrolling the whole page!
│                                           │
├─────────────────────────────────────────┤
│ 💡 Use the toolbar to zoom, navigate...  │  Helpful hints
└─────────────────────────────────────────┘
```

## Mobile Experience

### What Users See:
```
📖 Article Title
👤 By Author | 📜 International Law
📋 Summary text...

[📄 Open Full PDF] ← Button opens in new tab

Author Profile:
[📷 Photo] Author Name
  Class of 2028
```

## Usage

### In an Article Page

```javascript
import React from 'react';
import PDFViewer from './PDFViewer';

function ArticlePage() {
    return (
        <div className="article-page fade-in">
            <h1>Article Title</h1>
            <p className="article-meta">By Author • Date • Category</p>

            <div className="article-summary">
                <h2>Summary</h2>
                <p>Summary text...</p>
            </div>

            {/* Desktop PDF Viewer */}
            <PDFViewer
                pdfPath="/ArticlePDFs/your-file.pdf"
                title="Full Article Title"
                author="Author Name"
            />

            {/* Mobile PDF Button (only shows on mobile) */}
            <div className="pdf-actions">
                <a
                    href="/ArticlePDFs/your-file.pdf"
                    target="_blank"
                    className="cta-button pdf-button"
                >
                    📄 Open Full PDF
                </a>
            </div>
        </div>
    );
}

export default ArticlePage;
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `pdfPath` | `string` | ✅ Yes | Path to the PDF file (relative to public folder) |
| `title` | `string` | ✅ Yes | Full article title for display |
| `author` | `string` | ✅ Yes | Author name for display |

## How It Works

### Desktop (≥ 769px)
1. Shows `PDFViewer` component with embedded PDF
2. Hides the `pdf-actions` "Open Full PDF" button
3. Users can read PDF directly in the page
4. Browser controls available for zoom, navigate, download

### Mobile (< 769px)
1. Hides `PDFViewer` component entirely
2. Shows the `pdf-actions` "Open Full PDF" button
3. Button opens PDF in new tab/download
4. Optimal for mobile where PDFs don't display well

## Customization

### Change PDF Viewer Height

Edit `PDFViewer.css`:

```css
.pdf-object {
    height: 700px;  /* Adjust this value */
}
```

### Adjust Header Colors

```css
.pdf-viewer-header {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
    /* Change to your preferred colors */
}
```

### Modify Shadow Effects

```css
.pdf-viewer-container {
    box-shadow: 
        0 4px 6px rgba(0, 0, 0, 0.05),
        0 10px 15px rgba(0, 0, 0, 0.1),
        0 25px 50px rgba(0, 0, 0, 0.15);
    /* Adjust or remove for different effect */
}
```

### Change Border Radius

```css
.pdf-viewer-container {
    border-radius: 16px;  /* 0 = sharp corners, 24px = more rounded */
}

.pdf-viewer-frame {
    border-radius: 8px;  /* Inner PDF frame */
}
```

### Breakpoint for Mobile/Desktop

Adjust display trigger in `PDFViewer.css`:

```css
/* Desktop only */
@media (max-width: 768px) {
    .pdf-viewer-container {
        display: none;  /* Hide PDF viewer on screens ≤ 768px */
    }
}
```

## Current Implementation

### Articles Using PDF Viewer:
1. ✅ **Dangerous Implications** by Derek Tsai
2. ✅ **Schoolhouse Secrets** by Shelby Eliasek

Both have:
- Desktop: Beautiful embedded PDF viewer
- Mobile: "Open Full PDF" button

## File Structure

```
src/
├── Components/
│   ├── PDFViewer.js          # Component
│   ├── PDFViewer.css         # Styles
│   └── PDFViewer.README.md   # Documentation
├── ArticlePages/
│   ├── DangerousImplications.js
│   └── SchoolhouseSecrets.js
└── Styling/
    └── Journal.css           # Article page styles
```

## Benefits

✅ **Better UX on desktop** - No need to leave page to read PDF  
✅ **Maintains mobile experience** - Button still works perfectly on phones  
✅ **Professional look** - Document-style frame looks like a journal  
✅ **Fast loading** - Embedded PDF loads efficiently  
✅ **Browser controls** - Zoom, print, download all available  
✅ **Responsive** - Automatically adjusts for different screen sizes  

## Browser Support

✅ Chrome/Edge - Full PDF viewing support  ✅ Firefox - PDF.js integration  ✅ Safari - Native PDF viewing  
⚠️ Mobile browsers - Falls back to download button (by design)  

## Performance

- Lazy loading: PDF loads when component mounts
- Constrained height: Doesn't render full PDF at once
- Clean DOM removal: Hidden on mobile to save resources

## Accessibility

- Semantic HTML structure
- Keyboard accessible download button
- Clear visual hierarchy
- Helpful hints for navigation

## Tips

1. **PDF file size**: Keep PDFs under 10MB for optimal loading  
2. **PDF quality**: Use 72-150 DPI for web viewing  
3. **Mobile testing**: Always test PDF button on actual phones  
4. **Alt text**: Consider adding PDF description for screen readers  
5. **Loading states**: Add loading spinner for large PDFs

## Future Enhancements

- [ ] Loading spinner animation
- [ ] Page number display
- [ ] Print button
- [ ] Fullscreen mode
- [ ] Thumbnail navigation
- [ ] Dark mode for PDF viewer
- [ ] Bookmark functionality
- [ ] Highlight/annotations support

## Troubleshooting

### PDF not displaying
- Check PDF path is correct (relative to public folder)
- Verify PDF file exists and is accessible
- Check browser console for errors
- Test PDF in browser directly to ensure it's valid

### PDF viewer shows on mobile
- Verify media query in PDFViewer.css
- Check browser width (use dev tools)
- Clear browser cache

### Button not showing on mobile
- Ensure `pdf-actions` div is present
- Check CSS display properties
- Verify button class matches

## Example: Adding PDF Viewer to a New Article

```javascript
// src/ArticlePages/MyArticle.js
import React from 'react';
import '../Styling/Journal.css';
import PDFViewer from '../Components/PDFViewer';

function MyArticle() {
    return (
        <div className="article-page fade-in">
            <h1>Article Title</h1>
            <p className="article-meta">By Author • Date • Category</p>
            
            <div className="article-summary">
                <h2>Summary</h2>
                <p>Summary text...</p>
            </div>
            
            <PDFViewer 
                pdfPath="/ArticlePDFs/my-article.pdf"
                title="Article Title"
                author="Author Name"
            />
            
            <div className="pdf-actions">
                <a href="/ArticlePDFs/my-article.pdf" target="_blank" className="cta-button pdf-button">
                    📄 Open Full PDF
                </a>
            </div>
            
            <footer className="article-footer">
                {/* Author info */}
            </footer>
        </div>
    );
}

export default MyArticle;
```

## Credits

Built with React and CSS for optimal desktop PDF viewing and mobile compatibility.
