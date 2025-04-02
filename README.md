# Static Website

A simple, static website for technical documentation with code highlighting and theme support.

## Features

- Clean, responsive design
- Dark/light theme toggle
- Secure syntax highlighting for code blocks
- Collapsible code sections
- Simplified build system

## Security Improvements

- Proper HTML escaping in code blocks
- Configured highlight.js with `ignoreUnescapedHTML: true`
- Protected against multiple re-highlighting of the same content
- Prevented mutation observer feedback loops

## Project Structure

```
.
├── build.py           # Build script with HTML escaping
├── css/               # CSS stylesheets
├── develop.py         # Development server with live reload
├── dist/              # Generated site (created when building)
├── js/                # JavaScript files (simplified)
│   └── main.js        # Consolidated JS functionality
├── partials/          # HTML content fragments
└── templates/         # HTML templates
```

## Development

### Prerequisites

- Python 3.6+
- Watchdog (`pip install watchdog`)

### Development Workflow

For the best development experience, use the development server with live reload:

```bash
# Install dependencies
pip install -r requirements.txt

# Start the development server
./develop.py
```

This will:
1. Build the initial site
2. Start a web server at http://localhost:8000
3. Watch for file changes and automatically rebuild

### Building the Site

To build the site:

```bash
./build.py
```

This will generate the site in the `dist` directory.

### Running the Site

To build and immediately serve the site:

```bash
./build.py --serve
```

Or build first and then run the server:

```bash
./build.py
python3 -m http.server 8000 --directory dist
```

Then open your browser at [http://localhost:8000](http://localhost:8000)

## Adding Content

1. Create or edit HTML fragments in the `partials` directory
2. For section content, follow the naming convention: `section_XX_name.html`
3. Run the build script to regenerate the site

## Customization

- Modify `templates/layout.html` to change the overall site structure
- Edit `css/styles.css` to customize the appearance
- Update `js/main.js` for JavaScript functionality 