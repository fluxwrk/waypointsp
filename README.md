<div align="center">

<img src="img/waypoint-icon-large.png" alt="Waypoint" width="200">

# Waypoint

### A Linux-inspired browser start page with a built-in command terminal, powerful customization, and a clean, modern interface.

<p>
  <img alt="GitHub Release" src="https://img.shields.io/github/v/release/waypointsp-dev/waypointsp">
  <img alt="License" src="https://img.shields.io/github/license/waypointsp-dev/waypointsp">
  <img alt="Last Commit" src="https://img.shields.io/github/last-commit/waypointsp-dev/waypointsp">
</p>

</div>

---

## Features

### Linux-Inspired Interface

- Built-in terminal with realistic command output
- `fetch` system information command
- Interactive Welcome TUI guide
- Comprehensive help system
- Command history and Linux-style prompt
- Terminal transparency and customization
- Internal `waypoint:` actions for built-in shortcuts

### Powerful Customization

- Multiple layout presets
- Compact and Grid bookmark layouts
- Theme support
- Custom accent and surface colors
- Advanced text color customization
- Custom fonts
- UI scaling
- Window transparency
- Terminal transparency
- Custom CSS support

### Dashboard

- Search bar with multiple search engine support
- Weather widget
- Live clock
- Hero banner
- Bookmark sections
- Drag-and-drop organization
- Hover controls for adding links, sections, and managing bookmarks

### First-Run Experience

- Demo profile loads on first launch
- Welcome and Settings starter bookmarks
- Full profile persistence in local browser storage
- Factory reset restores internal Waypoint defaults
- Import and export full profiles as JSON

### Power User Features

- Terminal configuration commands
- `ls` command for discovering themes, layouts, fonts, visibility options, search engines, and current config
- Per-category settings reset
- Custom CSS manual through terminal help
- Responsive layout

---

## Screenshots

<div align="center">

![Dashboard](screenshots/maintokyo.png)

</div>

<details><summary><strong>More Screenshots</strong></summary>

<div align="center">

![Dashboard](screenshots/compactlistgruvbox.png)
![Dashboard](screenshots/minimal.png)
![Dashboard](screenshots/msettings.png)
![Dashboard](screenshots/wpdemo.gif)

</div>

</details>

---

## Live Demo

Waypoint can be hosted as a static site. The demo profile is loaded only on first launch. After that, each user's configuration is stored locally in their own browser.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/waypointsp-dev/waypointsp.git
```

Or download the latest release from the **Releases** page.

Open `index.html` in your browser.

No installation required.

---

## Terminal

Waypoint includes a built-in Linux-inspired command terminal.

Examples:

```text
fetch
help
welcome
ls themes
theme nord
layout compact
font "JetBrains Mono"
hide weather
show clock
engine duckduckgo
export
```

---

## Customization

Waypoint supports:

- Themes
- Fonts
- Layout presets
- Bookmark layouts
- Custom colors
- Text color controls
- Custom CSS
- Window transparency
- Terminal transparency
- First-launch demo profile configuration

Designed to be customized without editing source code.

---

## Branches

- `main` contains the latest stable release.
- `dev` contains active development builds and may include unfinished or unstable features.

---

## Roadmap

### Completed

- ✅ v1.0 — Foundation
- ✅ v1.1 — Personalization
- ✅ v1.2 — Terminal Upgrade
- ✅ v1.3 — First Experience & Onboarding

### Planned

- 🚧 v1.4 — Layouts & Profiles
- 🔲 v1.5 — Power User

---

## License

Copyright (C) 2026 waypointsp-dev

Licensed under the GNU General Public License v3.0 or later.

See the LICENSE file for details.
