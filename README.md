# QuickAdd
Quickly add new pages or content to your vault.
### Demo
![zApIWkHrKP](https://user-images.githubusercontent.com/29108628/121762835-bb8b2e80-cb38-11eb-8ef6-b65700526caf.gif)

## Installation
**This plugin is in the community plugin browser in Obsidian**. You can search for it and install it there .

You can also do a [manual installation](docs/ManualInstallation.md).

## What's new?
### 0.3.14-15
- You can now pass variables to the choice being executed with ``executeChoice``.
- Fixed bug where ``{{VALUE}}`` would not be registered in capture to active file

### 0.3.12-13
- Added a bunch of new commands to macros
  - Copy
  - Cut
  - Paste
  - Select active line
  - Select link in active line
- You can now add Template and Capture choices to macros without having them in your main settings.
- You will now be prompted when attempting to delete a command from a macro.

### 0.3.10 - 0.3.11
- Added a warning when deleting a Multi choice that you will delete all choices within.
- Fix #51 - Templater syntax is now processed when appending to the current file.
- Fix "Template (not found)" for templates that exist.
- Fix #46 - Error if adding a template that doesn't exist.
- Template: Create file in same folder as current file.
- Fix bug with insertion and creation of 'Insert After' line (if it does not exist).
- Mobile friendly UX for adding choices.

## Getting started
The first thing you'll want to do is add a new choice. A choice can be one of four types.
- [Template Choice](docs/Choices/TemplateChoice.md) - A powerful way to insert templates into your vault.
- [Capture Choice](docs/Choices/CaptureChoice.md) - Quick capture anything, anywhere.
- [Macro Choice](docs/Choices/MacroChoice.md) - Macros to augment your workflow. Do more, faster.
- [Multi Choice](docs/Choices/MultiChoice.md) - Organize your choices in folders.

In your choices, you can use [format syntax](docs/FormatSyntax.md), which is similar to the Obsidian template syntax.

You could, for example, use ``{{DATE}}`` to get the current date.

## I'm ready to _augment my workflow_ 🚀
That's the spirit. What do you want to do?

### I want to...
#### Be inspired
Take a look at some examples...
- [Capture: Add Journal Entry](docs/Examples/Capture_AddJournalEntry.md)
- [Macro: Log book to daily journal](docs/Examples/Macro_LogBookToDailyJournal.md)
- [Template: Add an Inbox Item](docs/Examples/Template_AddAnInboxItem.md)
- [Macro: Move all notes with a tag to a certain folder](docs/Examples/Macro_MoveNotesWithATagToAFolder.md)
- [Template: Automatically create a new book note with notes & highlights from Readwise](docs/Examples/Template_AutomaticBookNotesFromReadwise.md)
- [Capture: Add a task to a Kanban board](docs/Examples/Capture_AddTaskToKanbanBoard.md)
- [Macro: Easily change properties in your daily note (requires MetaEdit)](docs/Examples/Macro_ChangePropertyInDailyNotes.md)
- [Capture: Fetch tasks from Todoist and capture to a file](docs/Examples/Capture_FetchTasksFromTodoist.md)
- [Macro: Zettelizer - easily create new notes from headings while keeping the contents in the file](docs/Examples/Macro_Zettelizer.md)
- [Macro: Obsidian Map View plugin helper - insert location from address](docs/Examples/Macro_AddLocationLongLatFromAddress.md)

#### Create powerful scripts and macros to automate my workflow
Take a look at the [QuickAdd API](docs/QuickAddAPI.md), [format syntax](docs/FormatSyntax.md), [inline scripts](docs/InlineScripts.md), and [macros](docs/Choices/MacroChoice.md).

#### Use QuickAdd even when Obsidian is minimized / in the background
You got it. Take a look at [this AutoHotKey script](docs/AHK_OpenQuickAddFromDesktop.md).

