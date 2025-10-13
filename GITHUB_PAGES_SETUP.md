# GitHub Pages Deployment Guide

## Quick Setup for GitHub Pages

### 1. Repository Setup
1. Create a new repository on GitHub
2. Upload all files from this project to the repository
3. Make sure all files are in the root directory (not in a subfolder)

### 2. Enable GitHub Pages
1. Go to your repository settings
2. Scroll to "Pages" section
3. Source: Deploy from a branch
4. Branch: main (or master)
5. Folder: / (root)
6. Click Save

### 3. Your website will be available at:
```
https://yourusername.github.io/your-repository-name
```

## Automatic Deployment
The `.github/workflows/deploy.yml` file is already configured for automatic deployment.
Every time you push to the main branch, your site will automatically update.

## Important Notes for GitHub Pages

### File Paths
- All asset paths are already configured as relative paths (starting with `./`)
- Three.js libraries use CDN fallbacks for better reliability
- Data files use relative paths: `./data/sample-data.json`

### Browser Compatibility
- Works on all modern browsers that support WebGL
- Fallback content is shown if 3D graphics aren't supported
- Mobile-friendly responsive design

### Performance Tips
- Images are optimized for web
- JavaScript libraries use CDN for faster loading
- 3D scenes have simplified geometry for better performance

## Troubleshooting

### If 3D scenes don't load:
1. Check browser console for errors
2. Ensure WebGL is supported in the browser
3. CDN fallbacks should handle most loading issues

### If data doesn't load:
- GitHub Pages sometimes has CORS restrictions
- All paths are relative to avoid issues
- Sample data is included as fallback

## File Structure for GitHub Pages
```
/
├── index.html          (Main landing page)
├── air.html           (Air pollution page)  
├── water.html         (Water pollution page)
├── light.html         (Light pollution page)
├── presentation.html  (Hackathon presentation)
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   ├── air-3d.js      (Fixed for GitHub Pages)
│   ├── water-3d.js
│   ├── light-3d.js
│   └── charts.js      (Fixed for GitHub Pages)
├── data/
│   └── sample-data.json
├── assets/
│   └── (images, icons)
├── .github/
│   └── workflows/
│       └── deploy.yml (Auto-deployment)
└── README.md
```

## Ready to Deploy!
Your project is now configured and ready for GitHub Pages hosting. Just upload to your repository and enable Pages in settings!