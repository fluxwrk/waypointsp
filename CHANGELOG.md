# Changelog

All notable changes to Waypoint will be documented in this file.

## [Unreleased]

### Added
- Added banner size presets: Hidden, Small, Medium, and Large.
- Added banner size support to profile settings and terminal banner commands.

### Changed
- Banner height presets are now presented as simpler banner size options.
- Existing `heroHeight` profile values are normalized into the new banner size system for compatibility.

### Fixed
-

---

## [1.3.0] - 2026-06-26

### Added
- Added interactive Welcome TUI guide.
- Added internal `waypoint:` bookmark actions.
- Added built-in Welcome and Settings starter bookmarks.
- Added `demo.json` first-launch profile support.
- Added hover/focus Add Section tile for creating sections from the homepage.

### Changed
- First launch now loads the full `demo.json` profile and saves it to local storage.
- User changes now persist through the same profile save/load path after first launch.
- Factory Reset now restores internal Waypoint defaults instead of reloading the demo profile.
- Improved terminal Welcome guide sizing, spacing, and layout.
- Centralized internal bookmark action handling for future built-in actions.

### Fixed
- Fixed first-launch profile loading only applying bookmarks instead of full appearance/profile settings.
- Fixed second-launch failures caused by persisted demo profile data.
- Fixed duplicate icons on internal bookmarks.
- Fixed drag-and-drop into empty bookmark sections.
- Fixed TUI text clipping in the Import/Export guide page.

---

## [1.2.7] - 2026-06-24

### Fixed
- Fixed Terminal Transparency from the Advanced settings slider.
- Fixed `terminal transparency <60-100>` so it updates the terminal immediately.
- Terminal Transparency now affects the terminal window, titlebar, and terminal screen instead of only the outer window.
- Terminal Transparency slider now syncs with saved settings and command changes.

---

## [1.2.6] - 2026-06-24

### Added
- First-launch default links.
- Waypoint favicon.
- Expanded font choices.
- `ls` command for commands, themes, layouts, fonts, visibility, search, and config.
- Getter behavior for core terminal commands.
- Terminal transparency command and setting.
- Per-page reset buttons in Settings.

### Changed
- Overhauled terminal help so `help` lists commands and `help <topic>` shows usage.
- Replaced `man css` with `help css`.
- Consolidated text color controls into Text Colors.
- Improved terminal output color separation.
- Clarified window vs terminal transparency commands.

### Fixed
- Missing command arguments now return usage instead of unintended behavior.
- `settings text` opens the Text Colors page.
- `weather` no longer sets a bogus location when used without arguments.

---

## [1.2.5] - 2026-06-24

### Added
- Added Window Transparency control for modal and terminal window surfaces.

### Changed
- Surface Color now uses the same compact color control style as Accent and Text colors.
- Terminal Text color now controls the terminal prompt instead of command input text.
- Terminal output now has clearer default color separation for help, status, normal output, and emphasized labels.

### Fixed
- Fixed Surface Color still showing as a full-width color strip in Settings.

---

## [1.2.4] - 2026-06-24

### Added
- Added a Text Colors settings page for targeted text customization.
- Added controls for section title, bookmark, muted, terminal, and clock/weather text colors.
- Added terminal commands for `surface` and `titlecolor`.

### Changed
- Surface Color now applies across main panels, cards, settings, terminal, search, and bookmark surfaces.
- Accent Color now affects interactive highlights including bookmark hover states, buttons, active tabs, and borders.
- Compact color controls now take up less space in Settings.
- Dashboard layout is now distinct from Classic, with the banner hidden and a denser dashboard-style section grid.

### Fixed
- Fixed Surface Color only appearing on clock/weather hover states.
- Fixed Accent Color not clearly affecting bookmark hover highlights.

---

## [1.2.3] - 2026-06-24

### Added
- Added `default-links.json` for screenshots, demos, and clean testing.
- Added real weather emoji icons for common weather states.

### Changed
- Increased the terminal window size for a more usable command interface.
- Restored banner height presets.

### Fixed
- Restored movable Settings window behavior.
- Removed Settings modal background blur again.
- Restored working UI Scale behavior.

---

## [1.2.2] - 2026-06-24

### Fixed
- Restored normal multi-column section layout after the v1.2.0 terminal upgrade regression.
- Fixed section cards stretching full-width on desktop.
- Fully hides section title headers while preserving add and delete controls.

---

## [1.2.1] - 2026-06-24

### Fixed
- Fixed bookmark sections appearing empty after importing simple category-based JSON files.
- Fixed hidden section titles leaving visible header bars.
- Preserved section add/delete controls while section titles are hidden.
- Updated terminal placeholder text to reference `fetch` only.

---

## [1.2.0] - 2026-06-24

### Added
- Rebuilt the terminal output system around persistent scrollback.
- Added realistic command echo output using the active Waypoint prompt.
- Added a redesigned `fetch` command with Waypoint ASCII art and system-style information.
- Added expanded terminal help topics.
- Added `man css` with clearer Custom CSS examples and explanations.

### Changed
- Terminal commands now append to history instead of replacing previous output.
- Terminal responses now use more Linux-style formatting.
- Command errors now use terminal-style feedback.
- Custom CSS help is available from Settings and the terminal.

### Fixed
- Hide Section Titles now fully collapses the section header area while preserving section controls.
- Removed the banner settings cog from the interface.

---

## [1.1.2] - 2026-06-24

### Fixed
- Settings now default to the **Appearance** page when opened.
- Removed the banner settings cog for a cleaner interface.
- Added `man css` terminal documentation.
- Added a Custom CSS help button linking to the CSS manual.
- Replaced confusing placeholder CSS examples with a clearer documentation path.

### Changed
- Hide Section Titles now minimizes the section header (planned improvement: fully hide the header while preserving section functionality).

---

## [1.1.1] - 2026-06-24

### Added
- Movable Settings window.
- Custom CSS support.
- Built-in CSS help examples.
- Layout presets for banner height.

### Changed
- Renamed **Panel Color** to **Surface Color**.
- Surface Color now applies more consistently across interface panels.
- Removed background blur while the Settings window is open.
- Banner height control changed from a slider to presets.

### Fixed
- UI Scale now correctly scales the interface.
- Settings window intended to default to Appearance (follow-up hotfix required).

---

## [1.1.0] - 2026-06-24

### Added
#### Personalization
- Split Settings into multiple pages

#### Appearance
- Custom fonts
- UI scaling
- Custom colors
- Layout presets
- Bookmark layout/column/sizing controls

#### Interface
- Hide/show UI elements
- Reduced Waypoint wordmark size
- Theme customization improvements

#### Power User
- Initial Custom CSS support
- Theme import/export groundwork

#### Terminal
- Added terminal commands for new personalization settings
- Standardized around a single `fetch` command

### Changed
- Reorganized Settings into categorized pages
- Modernized personalization workflow
