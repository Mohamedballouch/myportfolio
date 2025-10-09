# Mohamed Ballouch - Portfolio

A modern, responsive portfolio website showcasing expertise in Generative AI, Machine Learning, and AI solution development.

## Features

### 🌍 Multilingual Support
- **English** (default)
- **French** - Contextual translations that preserve professional tone
- Easy language switching with animated toggle button
- Automatic language preference saving

### 🎨 Modern Design
- Dark theme with gradient accents
- Smooth animations and transitions
- Mobile-responsive design
- Professional typography

### 📱 Responsive Layout
- Optimized for all device sizes
- Touch-friendly navigation
- Adaptive content layout

## Language Implementation

The portfolio includes contextually appropriate French translations that:
- Maintain professional terminology
- Preserve technical accuracy
- Adapt to French business communication style
- Keep the same professional impact

### Translation Features
- **Contextual Adaptation**: Not just literal translation, but culturally appropriate content
- **Technical Precision**: Accurate translation of AI/ML terminology
- **Professional Tone**: Maintains the same level of professionalism in both languages
- **SEO Optimization**: Translated meta tags and descriptions for better search visibility

### How to Use
1. Visit the portfolio website
2. Use the EN/FR toggle in the top navigation
3. All content will smoothly transition to the selected language
4. Your language preference is automatically saved

## Technical Implementation

### Files Structure
```
portfolio/
├── index.html          # Main portfolio page
├── script.js           # JavaScript functionality
├── styles.css          # Styling (embedded in HTML)
├── translations.js     # Translation system and content
└── README.md          # This file
```

### Key Components
- **TranslationManager**: Handles language switching and content updates
- **Language Toggle**: Animated UI component for language selection
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **SEO Optimization**: Language-specific meta tags and structured data

## Sections Included

1. **Hero Section** - Introduction and call-to-action
2. **About** - Professional background and statistics
3. **Skills** - Technical expertise organized by categories
4. **Experience** - Professional timeline with achievements
5. **Projects** - Featured work with descriptions and links
6. **Publications** - Academic and professional publications
7. **Education** - Academic background and certifications
8. **Contact** - Professional contact information

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Optimized loading with minimal dependencies
- Efficient translation system
- Smooth animations with hardware acceleration
- Responsive images and content

## Future Enhancements

- Additional language support (Arabic, Spanish)
- Dark/Light theme toggle
- Interactive project demos
- Contact form with backend integration
- Blog section for technical articles

---

© 2025 Mohamed Ballouch. All rights reserved.

A modern, responsive portfolio website showcasing my expertise in Generative AI, Machine Learning, and Full-Stack Development.

![Portfolio Preview](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Version](https://img.shields.io/badge/Version-1.0.0-orange)

## 🚀 Quick Start

### Deploying to GitHub Pages

1. **Fork or Clone this Repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Create a GitHub Repository**
   - Go to [GitHub](https://github.com/new)
   - Create a new repository named `yourusername.github.io` (replace with your GitHub username)
   - Keep it public and don't initialize with README

3. **Push to Your Repository**
   ```bash
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click Save

5. **Access Your Portfolio**
   - Your site will be available at `https://yourusername.github.io`
   - It may take a few minutes to deploy

## 📁 File Structure

```
portfolio/
│
├── index.html          # Main HTML file (includes inline CSS/JS)
├── styles.css          # Separated CSS file (optional)
├── script.js           # Separated JavaScript file (optional)
├── README.md           # This file
│
├── assets/             # Assets folder (create if needed)
│   ├── images/         # Your images
│   ├── docs/           # Your documents/resume
│   └── favicon/        # Favicon files
│
└── .gitignore          # Git ignore file
```

## 🎨 Customization

### 1. Personal Information
Update the following in `index.html`:
- Name and title in the hero section
- Contact information (email, phone, location)
- Social media links (LinkedIn, GitHub, etc.)
- Professional summary in the about section

### 2. Adding Your Photo
Replace the placeholder in the about section:
```html
<div class="about-image-wrapper">
    <img src="assets/images/your-photo.jpg" alt="Mohamed Ballouch">
</div>
```

### 3. Colors and Theme
Modify CSS variables in `:root`:
```css
:root {
    --primary-color: #00d4ff;    /* Main accent color */
    --secondary-color: #00ff88;   /* Secondary accent */
    --bg-dark: #0a0f1b;          /* Dark background */
    --text-primary: #ffffff;      /* Primary text */
}
```

### 4. Adding Projects
Add new projects in the projects section:
```html
<div class="project-card">
    <div class="project-image">
        <i class="fas fa-project-icon"></i>
    </div>
    <div class="project-content">
        <h3>Project Title</h3>
        <p>Project description...</p>
        <div class="project-tech">
            <span class="tech-tag">Technology</span>
        </div>
        <div class="project-links">
            <a href="github-link" target="_blank">
                <i class="fab fa-github"></i> View Code
            </a>
        </div>
    </div>
</div>
```

### 5. Updating Experience
Modify the timeline items in the experience section with your work history.

### 6. Skills Section
Update skill categories and tags to match your expertise.

## 🔧 Advanced Configuration

### Using Separate Files
The portfolio can work with either:
1. **Single file** (index.html with inline CSS/JS) - Easier to manage
2. **Multiple files** (index.html + styles.css + script.js) - Better organization

To use separate files:
1. Move CSS from `<style>` tags to `styles.css`
2. Move JavaScript from `<script>` tags to `script.js`
3. Link them in `index.html`:
```html
<link rel="stylesheet" href="styles.css">
<script src="script.js"></script>
```

### Adding a Contact Form
To add a working contact form, you'll need a backend service like:
- [Formspree](https://formspree.io/)
- [EmailJS](https://www.emailjs.com/)
- [Netlify Forms](https://www.netlify.com/products/forms/)

### SEO Optimization
Update meta tags in the `<head>` section:
```html
<meta name="description" content="Your description">
<meta name="keywords" content="your, keywords">
<meta property="og:title" content="Your Name - Portfolio">
<meta property="og:description" content="Your description">
<meta property="og:image" content="https://yourdomain.com/preview.jpg">
```

## 🌟 Features

- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Smooth scrolling navigation
- ✅ Animated sections on scroll
- ✅ Modern dark theme with tech aesthetic
- ✅ SEO optimized
- ✅ Fast loading and performance optimized
- ✅ Cross-browser compatible
- ✅ GitHub Pages ready

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 🤝 Contributing

Feel free to fork this project and customize it for your own use!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Inspiration from modern portfolio designs

## 📞 Contact

**Mohamed Ballouch**
- LinkedIn: [mohamed-ballouch](https://linkedin.com/in/mohamed-ballouch)
- GitHub: [Mohamedballouch](https://github.com/Mohamedballouch)

---

⭐ Don't forget to star this repo if you found it helpful!
