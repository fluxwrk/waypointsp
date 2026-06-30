# Changelog

## v1.5.0-dev1 - Hero Evolution foundation
- Added Workspace-owned Hero Style with Standard Hero, Top Bar, and Bottom Bar options.
- Added OS-style top/bottom bar presentation that integrates logo, wordmark, clock, and weather while forcing Search to standalone.
- Added Workspace Studio Hero Style controls so templates cannot express layouts Studio cannot create.
- Added Workspace-aware destination availability so Hero Search, Header Search, and Banner destinations are disabled when unavailable.
- Added Workspace-aware Banner settings disabling and explanatory messaging for bar styles and hidden banners.

## v1.4.0-dev10e - Wallpaper/banner fallback fix
- Added resilient wallpaper fallback layering so missing packaged image paths no longer leave the page black.
- Added hero banner fallback handling so broken banner images do not show alt text on the card.
- Preserved dev10d Workspace Studio polish changes.


All notable changes to Waypoint will be documented in this file.

## [Unreleased]

## [1.4.0-dev10d] - 2026-06-29

### Changed
- Made the Workspace Studio launcher quieter by default so it no longer highlights whenever the page is hovered.
- Moved the default Workspace Studio panel position to the upper-right open workspace area.
- Centered the Add Section tile vertically next to the section row.

### Fixed
- Removed the duplicate Current badge on Workspace Studio destination cards.

### Added
- Added drag-to-move support for the Workspace Studio panel.

## [1.4.0-dev10c] - 2026-06-29

### Changed
- Tightened header slot presentation so Clock and Weather fit side slots without overlapping.
- Reduced Weather widget width and added compact side-slot styling.
- Replaced the hover-only Workspace Studio launcher with a stable square pencil tile.

### Fixed
- Fixed the Workspace Studio launcher disappearing before it could be clicked.
- Fixed left/right header slot overlap when Clock and Weather occupy the same header side.

## [1.4.0-dev10b] - 2026-06-29

### Added
- Added hidden item support to Workspace Studio so hidden widgets can be selected and restored.
- Added occupied/unavailable destination states in Workspace Studio.
- Added a subtle hover-revealed main-page Workspace Studio launcher.
- Added a Create Section modal so new sections are named before creation.

### Changed
- Refined Workspace Studio panel navigation and moved Done/Reset into the panel.
- Removed the redundant bottom Workspace Designer bar.
- Reduced header side slots to two per side while keeping four center slots and exclusive Header Search.
- Replaced the wide Add Section tile with a small square plus tile.
- Removed the Centered template; centered header placement remains available through normal Workspace slots.
- Suppressed normal widget actions while Workspace Studio is active so clicks select widgets instead.

### Fixed
- Fixed panel item clicks being cleared immediately by the page click handler.
- Fixed Banner being impossible to restore from Workspace Studio after being hidden.
- Fixed occupied header slots appearing as valid destinations.


### Added
- Added v1.4.0-dev10 Workspace Studio header slot grid with four slots each for Header Left, Header Center, and Header Right.
- Added Header Search as an exclusive center-header search destination.
- Added Workspace Studio movement support for header widgets across explicit header positions.

### Changed
- Centered template now uses normal Workspace header slots instead of template-only header positioning.
- Workspace Studio panel now docks away from the header so it does not block Clock or Weather.
- Search destinations now include Hero Search, Standalone Search, Header Search, and Hidden.

### Fixed
- Fixed header widgets appearing unable to move unless other widgets were hidden.
- Fixed panel item selection not clearly selecting the matching workspace item.
- Fixed duplicate header-slot collisions by validating and swapping occupied header positions.


### Added
- Added v1.4.0-dev10 Workspace Studio pass with a persistent user-facing customization panel.
- Added page-item list for visible and hidden Workspace widgets so hidden items can be restored without guessing.
- Added friendly location choices for movable Workspace items.

### Changed
- Reworked Edit Layout from a debug-style inspector into a clearer Workspace Designer experience.
- Replaced raw slot language in the editor with user-facing placement labels.
- Improved edit-mode widget affordances, selection feedback, and panel guidance.


### Added
- Added v1.4.0-dev10 Workspace Designer UX polish.
- Added click-to-select Workspace editing with valid destination choices.

### Changed
- Reworked Edit Layout into a user-facing Workspace Designer with clearer labels, selection feedback, and destination guidance.
- Improved the Workspace summary card to distinguish template defaults from customized workspaces.


### Fixed
- Fixed Dashboard and Minimal re-enabling the banner while leaving Search below the banner.
- Fixed the Centered template having no visible distinction from Classic.


### Added
- Added v1.4.0-dev9 Workspace Completion groundwork.
- Added Workspace validation before rendering so invalid widget slots are normalized safely.
- Added Workspace template status and descriptions in Settings > Workspace.

### Changed
- Templates now act as explicit starting points instead of active layout modes.
- Workspace now owns search/banner placement, visibility, and section title display.
- The template selector no longer changes layout immediately; users must explicitly apply the selected template.
- Standalone Search is now a valid Workspace slot below the banner instead of an accidental fallback state.

### Fixed
- Removed remaining legacy `layout-*` CSS behavior that could override Workspace rendering.
- Fixed Search being forced back into Hero Search when Standalone Search is intentionally selected while the banner is visible.

### Added
- Added Edit Layout inspector mode for visualizing registered widget boundaries.
- Added an Edit Layout button to Layout settings and a floating Done/Reset Layout inspector bar.
- Added banner size presets: Hidden, Small, Medium, and Large.
- Added banner size support to profile settings and terminal banner commands.

### Changed
- Banner height presets are now presented as simpler banner size options.
- Existing `heroHeight` profile values are normalized into the new banner size system for compatibility.
- Layout presets now apply visibility defaults once instead of permanently overriding user visibility settings.

### Fixed
- Fixed Dashboard banner size preset regression after the widget foundation build.
- Fixed Dashboard and Minimal layout presets permanently hiding UI elements that users later tried to re-enable.
- Fixed terminal `show banner` and `hide banner` using the old banner visibility path instead of Banner Size.
- Fixed Dashboard and Minimal placing search below the banner after the banner was re-enabled.

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
