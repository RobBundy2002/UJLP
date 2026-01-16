# Issue Filter Component

## Overview
A professional issue archive filter with animated tabs that organizes journal articles by publication issue/volume. Perfect for academic journals with multiple issues per year.

## Features

✅ **Issue-based organization** - Group articles by issue (e.g., "2026 Issue 1", "2025 Issue 2")  
✅ **Animated tab switching** - Smooth transitions between filters  
✅ **Issue badges on articles** - Clear visual indicator of which issue each article belongs to  
✅ **Typing animation on categories** - Categories type themselves in (already integrated)  
✅ **Responsive design** - Tabs adjust for mobile screens  
✅ **Professional academic look** - Matches journal aesthetic  
✅ **Empty state handling** - Shows message when no articles in selected issue  

## How It Works

### Issue Filter Component
- Renders clickable tabs for each issue
- Tracks currently active issue (state)
- Filters article list based on selection
- Provides smooth transition animations

### Article Cards
- Display issue badge above title
- Show article category with typing animation
- Link to full article page
- Display author, date, and excerpt

## Usage

### In Journal Page

```javascript
import IssueFilter from '../Components/IssueFilter';

const issues = [
    { id: 'all', label: 'All Issues' },
    { id: '2026-1', label: '2026 Issue 1' },
    { id: '2025-2', label: '2025 Issue 2' },
    ...more issues
];

const articles = [
    {
        title: "Article Title",
        author: "Author Name",
        authorLink: "/author/author",
        category: "Category",
        date: "January 2026",
        issue: "2026-1",  // Must match issue id
        excerpt: "Article excerpt...",
        pageLink: "/article"
    },
    ...more articles
];

function Journal() {
    const [activeIssue, setActiveIssue] = useState('all');

    const filteredArticles = activeIssue === 'all' 
        ? articles 
        : articles.filter(article => article.issue === activeIssue);

    return (
        <div className="journal-container">
            <IssueFilter 
                issues={issues} 
                activeIssue={activeIssue} 
                onIssueChange={setActiveIssue} 
            />
            <div className="articles-grid">
                {filteredArticles.map((article, index) => (
                    <article key={index}>
                        {/* Article card content */}
                    </article>
                ))}
            </div>
        </div>
    );
}
```

## Customization

### Adding New Issues

```javascript
const issues = [
    { id: 'all', label: 'All Issues' },
    { id: '2026-1', label: '2026 Issue 1' },
    { id: '2026-Spring', label: 'Spring 2026' },
    { id: '2026-Winter', label: 'Winter 2026' },
    // Add more issues here
];
```

### Styling Issue Badges

Edit `IssueFilter.css`:

```css
.article-issue-badge {
    padding: 0.25rem 0.75rem;
    background: var(--primary-color);  /* Change badge color */
    color: white;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 0.5rem;
    text-transform: uppercase;
}
```

### Custom Tab Styling

```css
.issue-tab {
    background: var(--background-white);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.issue-tab.active {
    background: var(--primary-color);
    color: white;
}
```

### Animation Speeds

**Tab hover:**
```css
.issue-tab {
    transition: all 0.2s ease;  /* Faster */
}
```

**Filter transition:**
```css
.articles-grid {
    transition: opacity 0.5s ease, transform 0.5s ease;
}
```

### Filter Layout

**Horizontal tabs (default):**
```css
.issue-tabs {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
}
```

**Vertical tabs:**
```css
.issue-tabs {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
}
```

## Integration Notes

**Files:**
- Component: `src/Components/IssueFilter.js`
- Styles: `src/Components/IssueFilter.css`
- Used In: `src/GeneralPages/Journal.js`

**Dependencies:**
- React (useState)
- CSS (custom animations)

## Data Structure

### Issue Object
```javascript
{
    id: '2026-1',        // Unique identifier for matching
    label: '2026 Issue 1' // Display text for tab
}
```

### Article Object
```javascript
{
    title: "Article Title",
    author: "Author Name",
    authorLink: "/author/author",
    category: "Category",
    date: "January 2026",
    issue: "2026-1",     // Must match issue.id
    excerpt: "Excerpt...",
    pageLink: "/article"
}
```

## Current Implementation

### Articles Updated to 2026 Issue 1:
1. **Dangerous Implications** by Derek Tsai
2. **Schoolhouse Secrets** by Shelby Eliasek

### All Issues Configured:
- All Issues
- 2026 Issue 1
- 2025 Issue 2
- 2025 Issue 1
- 2024 Issue 2
- 2024 Issue 1

## Article Page Updates

Individual article pages now include issue information in metadata:

```javascript
<p className="article-meta">
    By {author} • {date} • {category} • {issue}
</p>
```

## Responsive Design

### Mobile (< 768px)
- Smaller tabs with reduced padding
- Shorter labels adapted
- Full-width grid for articles

### Small Mobile (< 480px)
- Minimal tab sizing
- Compact layout
- Optimized touch targets

## Browser Support

✅ All modern browsers (Chrome, Firefox, Safari, Edge)  
✅ Mobile browsers (iOS Safari, Chrome Mobile)  
✅ CSS Grid and Flexbox supported  

## Performance

- Efficient state management (React useState)
- CSS animations (hardware accelerated)
- Minimal re-renders on filter change
- No heavy libraries needed

## Accessibility

- Keyboard navigation (tab through issues)
- Visual focus indicators
- Semantic HTML structure
- Clear active state indication

## Tips

1. **Issue Naming:** Use consistent naming convention (e.g., "2026 Issue 1", "Spring 2026")
2. **Badge Visibility:** Ensure badge color contrasts well with card background
3. **Mobile Layout:** Consider reducing issue count on mobile to avoid clutter
4. **Empty States:** Always handle cases with no articles in filtered issue
5. **Default View:** Consider defaulting to most recent issue instead of "All"

## Example: Adding Issue Badge to Any Page

```javascript
import './IssueFilter.css';

function MyComponent() {
    return (
        <article>
            <div className="article-issue-badge">2026 Issue 1</div>
            <h3>Article Title</h3>
            {/* Rest of article content */}
        </article>
    );
}
```

## Future Enhancements

- [ ] Date range filtering within issues
- [ ] Issue cover images
- [ ] Export issue as PDF
- [ ] Issue-specific search
- [ ] Multi-issue selection
- [ ] Issue download (all articles in issue)

## Troubleshooting

### Articles not showing after filtering
- Check article `issue` property matches issue `id`
- Verify data is being filtered correctly
- Check console for errors

### Badge not displaying
- Ensure `IssueFilter.css` is imported
- Check CSS class name matches `article-issue-badge`
- Verify z-index (badge might be behind other elements)

### Tab animations not smooth
- Check CSS transition properties
- Ensure hardware acceleration available
- Verify browser supports used CSS properties

## Credits

Built with React hooks and CSS animations for optimal performance and maintainability.
