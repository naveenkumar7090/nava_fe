# CSS Styling Guide - Smart Vastu & Astro Admin

This project uses a modern CSS-based styling approach with CSS modules and global utilities for maintainable and scalable styles.

## 🎨 Styling Architecture

### 1. Global Styles (`src/styles/globals.css`)
- **CSS Variables**: Centralized design tokens for colors, spacing, typography
- **Reset & Base Styles**: Consistent cross-browser styling
- **Utility Classes**: Commonly used layout, spacing, and text utilities
- **Component Foundations**: Base button, form, card, and alert styles

### 2. Component Utilities (`src/styles/components.css`)
- **Enhanced Components**: Extended button variants, form components, modals
- **Utility Patterns**: Reusable component patterns and animations
- **Interactive Elements**: Hover states, transitions, and micro-interactions

### 3. CSS Modules (`*.module.css`)
- **Component-Specific Styles**: Scoped styles for individual components
- **BEM-like Naming**: Clear, descriptive class names
- **Responsive Design**: Mobile-first approach with breakpoint utilities

## 🎯 Design System

### Color Palette
```css
/* Primary - Vastu (Green) */
--primary-main: #2E7D32
--primary-light: #4CAF50
--primary-dark: #1B5E20

/* Secondary - Astro (Purple) */
--secondary-main: #7B1FA2
--secondary-light: #9C27B0
--secondary-dark: #4A148C

/* Semantic Colors */
--success-main: #388e3c
--warning-main: #f57c00
--error-main: #d32f2f
--info-main: #1976d2
```

### Typography Scale
```css
--font-size-xs: 0.75rem    /* 12px */
--font-size-sm: 0.875rem   /* 14px */
--font-size-base: 1rem     /* 16px */
--font-size-lg: 1.125rem   /* 18px */
--font-size-xl: 1.25rem    /* 20px */
--font-size-2xl: 1.5rem    /* 24px */
--font-size-3xl: 1.75rem   /* 28px */
--font-size-4xl: 2rem      /* 32px */
--font-size-5xl: 2.5rem    /* 40px */
```

### Spacing System
```css
--spacing-xs: 4px
--spacing-sm: 8px
--spacing-md: 16px
--spacing-lg: 24px
--spacing-xl: 32px
--spacing-xxl: 48px
```

## 🛠️ Usage Patterns

### 1. Global Utility Classes
```jsx
// Layout
<div className="flex items-center justify-between">
<div className="grid grid-cols-3 gap-4">

// Spacing
<div className="p-4 mb-3 mt-2">

// Typography
<h1 className="text-2xl font-bold text-primary">
<p className="text-sm text-secondary">

// Responsive
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 2. CSS Modules
```jsx
import styles from './Component.module.css';

// Scoped styles
<div className={styles.container}>
<button className={`${styles.button} ${styles.primary}`}>

// Conditional styles
<div className={`${styles.card} ${isActive ? styles.active : ''}`}>
```

### 3. Common Components
```jsx
// Buttons
<button className="btn btn-primary btn-lg">
<button className="btn btn-outline">
<button className="btn btn-ghost">

// Form Elements
<input className="form-input" />
<div className="form-group">
  <label className="form-label">Email</label>
  <input className="form-input error" />
  <div className="form-error">Invalid email</div>
</div>

// Cards
<div className="card card-hover">
<div className="card card-gradient">
<div className="card card-success">

// Alerts
<div className="alert alert-error">
<div className="alert alert-success">

// Badges
<span className="badge badge-primary">Admin</span>
<span className="badge badge-outline">Draft</span>

// Avatars
<div className="avatar avatar-lg avatar-primary">JD</div>
```

## 🎭 Component Examples

### Login Form
```jsx
<div className={styles.loginContainer}>
  <div className={styles.loginCard}>
    <div className={styles.cardContent}>
      <form className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <input className={`${styles.input} ${error ? styles.error : ''}`} />
        </div>
        <button className={styles.submitButton}>Sign In</button>
      </form>
    </div>
  </div>
</div>
```

### Dashboard Layout
```jsx
<div className={styles.dashboardContainer}>
  <div className={styles.topNavigation}>
    <div className={styles.toolbar}>
      <h1 className={styles.brandTitle}>App Name</h1>
      <div className={styles.userSection}>
        <div className={styles.userAvatar}>JD</div>
      </div>
    </div>
  </div>
  <div className={styles.mainContent}>
    <div className={styles.gridContainer}>
      <div className={styles.gridItem}>Content</div>
    </div>
  </div>
</div>
```

## 📱 Responsive Design

### Breakpoints
```css
--breakpoint-sm: 640px   /* Mobile */
--breakpoint-md: 768px   /* Tablet */
--breakpoint-lg: 1024px  /* Desktop */
--breakpoint-xl: 1280px  /* Large Desktop */
```

### Mobile-First Approach
```css
/* Base styles (mobile) */
.grid { grid-template-columns: 1fr; }

/* Tablet and up */
@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
}
```

## ✨ Interactive States

### Hover Effects
```css
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn:hover:not(:disabled) {
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}
```

### Focus States
```css
.form-input:focus {
  outline: none;
  border-color: var(--primary-main);
  box-shadow: 0 0 0 3px rgba(46, 125, 50, 0.1);
}
```

### Loading States
```css
.loading-spinner {
  animation: spin 1s linear infinite;
}

.form-loading {
  opacity: 0.8;
  pointer-events: none;
}
```

## 🎨 Theming & Customization

### CSS Variables for Easy Theming
```css
:root {
  /* Update these variables to change the theme */
  --primary-main: #2E7D32;
  --secondary-main: #7B1FA2;
  --bg-default: #f5f5f5;
  /* ... more variables */
}

/* Dark theme example */
[data-theme="dark"] {
  --bg-default: #121212;
  --bg-paper: #1e1e1e;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
}
```

## 🔧 Development Tips

### 1. Component Structure
```
components/
├── ComponentName/
│   ├── ComponentName.tsx
│   ├── ComponentName.module.css
│   └── index.ts
```

### 2. Naming Conventions
- **CSS Variables**: `--primary-main`, `--spacing-lg`
- **Utility Classes**: `text-primary`, `p-4`, `flex-col`
- **Module Classes**: `container`, `button`, `active`
- **BEM-like**: `card__header`, `button--primary`

### 3. Performance Considerations
- Use CSS modules for component-specific styles
- Leverage utility classes for common patterns
- Minimize inline styles
- Use CSS variables for dynamic theming

### 4. Accessibility
- Include focus styles for all interactive elements
- Use semantic HTML elements
- Ensure sufficient color contrast
- Support keyboard navigation

## 📋 Migration Benefits

### From Material-UI to CSS
✅ **Reduced Bundle Size**: No Material-UI JavaScript overhead
✅ **Full Control**: Complete customization over styles
✅ **Performance**: Pure CSS is faster than JS-in-CSS
✅ **Maintainability**: Clear separation of concerns
✅ **Flexibility**: Easy to implement custom designs
✅ **Learning**: Better understanding of CSS fundamentals

### Challenges Addressed
- **Consistency**: Global design system with CSS variables
- **Reusability**: Utility classes and component patterns
- **Responsiveness**: Mobile-first responsive utilities
- **Theming**: CSS variables for easy customization
- **Developer Experience**: Clear naming conventions and documentation

This CSS architecture provides a solid foundation for building scalable, maintainable, and performant user interfaces while maintaining the flexibility to customize and extend as needed.
