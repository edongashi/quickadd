# QuickAdd API

The QuickAdd API provides a powerful interface for automating tasks in Obsidian through scripts, macros, and inline scripts. The API offers methods for user interaction, file manipulation, AI integration, and more.

## Accessing the API

The API can be accessed in several ways:

### From QuickAdd Scripts (Macros/User Scripts)
```javascript
module.exports = async (params) => {
    const { quickAddApi, app, variables } = params;
    // Use quickAddApi here
};
```

### From Other Plugins/Scripts
```javascript
const quickAddApi = app.plugins.plugins.quickadd.api;
// Use the API methods
```

### From Templater Scripts
```javascript
<%*
const quickAddApi = app.plugins.plugins.quickadd.api;
const result = await quickAddApi.inputPrompt("Enter value:");
tR += result;
%>
```


## User Input Methods

### `inputPrompt(header: string, placeholder?: string, value?: string): Promise<string>`
Opens a prompt that asks for text input.

**Parameters:**
- `header`: The prompt title/question
- `placeholder`: (Optional) Placeholder text in the input field
- `value`: (Optional) Default value

**Returns:** Promise resolving to the entered string, or `null` if cancelled

**Example:**
```javascript
const name = await quickAddApi.inputPrompt(
    "What's your name?",
    "Enter your full name",
    "John Doe"
);

if (name) {
    console.log(`Hello, ${name}!`);
}
```

### `wideInputPrompt(header: string, placeholder?: string, value?: string): Promise<string>`
Opens a wider prompt for longer text input (multi-line).

**Parameters:** Same as `inputPrompt`

**Returns:** Promise resolving to the entered string, or `null` if cancelled

**Example:**
```javascript
const description = await quickAddApi.wideInputPrompt(
    "Project Description",
    "Enter a detailed description...",
    "This project aims to..."
);
```

### `yesNoPrompt(header: string, text?: string): Promise<boolean>`
Opens a confirmation dialog with Yes/No buttons.

**Parameters:**
- `header`: The dialog title
- `text`: (Optional) Additional explanation text

**Returns:** Promise resolving to `true` (Yes) or `false` (No)

**Example:**
```javascript
const confirmed = await quickAddApi.yesNoPrompt(
    "Delete Note?",
    "This action cannot be undone."
);

if (confirmed) {
    // Proceed with deletion
}
```

### `infoDialog(header: string, text: string[] | string): Promise<void>`
Shows an information dialog with an OK button.

**Parameters:**
- `header`: Dialog title
- `text`: Single string or array of strings (for multiple lines)

**Example:**
```javascript
await quickAddApi.infoDialog(
    "Operation Complete",
    [
        "Files processed: 10",
        "Errors: 0",
        "Time taken: 2.5 seconds"
    ]
);
```

### `suggester(displayItems: string[] | Function, actualItems: string[]): Promise<string>`
Opens a selection prompt with searchable options.

**Parameters:**
- `displayItems`: Array of display strings OR a map function
- `actualItems`: Array of actual values to return

**Returns:** Promise resolving to the selected value, or `null` if cancelled

**Examples:**

Basic usage:
```javascript
const fruit = await quickAddApi.suggester(
    ["🍎 Apple", "🍌 Banana", "🍊 Orange"],
    ["apple", "banana", "orange"]
);
```

With map function:
```javascript
const files = app.vault.getMarkdownFiles();
const selectedFile = await quickAddApi.suggester(
    file => file.basename,  // Display just the filename
    files                   // Return the full file object
);
```

Complex objects:
```javascript
const tasks = [
    { id: 1, title: "Task 1", priority: "high" },
    { id: 2, title: "Task 2", priority: "low" }
];

const selectedTask = await quickAddApi.suggester(
    task => `${task.title} (${task.priority})`,
    tasks
);
```

### `checkboxPrompt(items: string[], selectedItems?: string[]): Promise<string[]>`
Opens a checkbox prompt allowing multiple selections.

**Parameters:**
- `items`: Array of options to display
- `selectedItems`: (Optional) Array of pre-selected items

**Returns:** Promise resolving to array of selected items

**Example:**
```javascript
const features = await quickAddApi.checkboxPrompt(
    ["Dark Mode", "Auto-save", "Spell Check", "Line Numbers"],
    ["Auto-save", "Line Numbers"]  // Pre-selected
);

console.log("Enabled features:", features);
```

## Choice Execution

### `executeChoice(choiceName: string, variables?: {[key: string]: any}): Promise<void>`
Executes another QuickAdd choice programmatically.

**Parameters:**
- `choiceName`: Name of the choice to execute
- `variables`: (Optional) Variables to pass to the choice

**Example:**
```javascript
// Execute a template choice with variables
await quickAddApi.executeChoice("Create Meeting Note", {
    meetingTitle: "Project Review",
    attendees: "John, Jane, Bob",
    date: "2024-01-15",
    value: "Main agenda content"  // Special: maps to {{VALUE}}
});
```

Batch processing example:
```javascript
const contacts = [
    { name: "John Doe", email: "john@example.com", company: "ACME" },
    { name: "Jane Smith", email: "jane@example.com", company: "Tech Corp" }
];

for (const contact of contacts) {
    await quickAddApi.executeChoice("Create Contact", {
        contactName: contact.name,
        contactEmail: contact.email,
        contactCompany: contact.company
    });
}
```

## Utility Module

Access via `quickAddApi.utility`:

### `getClipboard(): Promise<string>`
Gets the current clipboard contents.

**Example:**
```javascript
const clipboardText = await quickAddApi.utility.getClipboard();
console.log("Clipboard contains:", clipboardText);
```

### `setClipboard(text: string): Promise<void>`
Sets the clipboard contents.

**Example:**
```javascript
await quickAddApi.utility.setClipboard("Hello, World!");
```

Combined example:
```javascript
// Transform clipboard contents
const original = await quickAddApi.utility.getClipboard();
const transformed = original.toUpperCase();
await quickAddApi.utility.setClipboard(transformed);
```

## Date Module

Access via `quickAddApi.date`:

### `now(format?: string, offset?: number): string`
Gets formatted current date/time.

**Parameters:**
- `format`: (Optional) Moment.js format string, defaults to "YYYY-MM-DD"
- `offset`: (Optional) Day offset (negative for past, positive for future)

**Examples:**
```javascript
// Current date
const today = quickAddApi.date.now();  // "2024-01-15"

// Custom format
const timestamp = quickAddApi.date.now("YYYY-MM-DD HH:mm:ss");

// With offset
const nextWeek = quickAddApi.date.now("YYYY-MM-DD", 7);
const lastMonth = quickAddApi.date.now("YYYY-MM-DD", -30);
```

### `tomorrow(format?: string): string`
Shorthand for `now(format, 1)`.

### `yesterday(format?: string): string`
Shorthand for `now(format, -1)`.

**Example:**
```javascript
const yesterdayLog = `Daily Notes/${quickAddApi.date.yesterday()}.md`;
const tomorrowTask = `Tasks for ${quickAddApi.date.tomorrow("dddd, MMMM D")}`;
```

## AI Module

Access via `quickAddApi.ai`:

### `prompt(prompt: string, model: string, settings?: object): Promise<object>`
Sends a prompt to an AI model and returns the response.

**Parameters:**
- `prompt`: The prompt text
- `model`: Model name (e.g., "gpt-4", "gpt-3.5-turbo")
- `settings`: (Optional) Configuration object:
  - `variableName`: Output variable name (default: "output")
  - `shouldAssignVariables`: Auto-assign to variables (default: false)
  - `modelOptions`: Model parameters (temperature, max_tokens, etc.)
  - `showAssistantMessages`: Show AI responses in UI (default: true)
  - `systemPrompt`: Override system prompt

**Returns:** Object with:
- `[variableName]`: The AI response
- `[variableName]-quoted`: The response in markdown quote format

**Example:**
```javascript
const result = await quickAddApi.ai.prompt(
    "Summarize this text: " + noteContent,
    "gpt-4",
    {
        variableName: "summary",
        modelOptions: {
            temperature: 0.3,
            max_tokens: 150
        }
    }
);

console.log(result.summary);
// Use in template: {{VALUE:summary}}
```

### `getModels(): string[]`
Returns available AI models.

**Example:**
```javascript
const models = quickAddApi.ai.getModels();
const selectedModel = await quickAddApi.suggester(models, models);
```

### `getMaxTokens(model: string): number`
Gets the maximum token limit for a model.

### `countTokens(text: string, model: string): number`
Counts tokens in text according to model's tokenization.

**Example:**
```javascript
const text = await quickAddApi.utility.getClipboard();
const tokenCount = quickAddApi.ai.countTokens(text, "gpt-4");

if (tokenCount > 4000) {
    await quickAddApi.infoDialog(
        "Text Too Long",
        `The text contains ${tokenCount} tokens, which exceeds the model limit.`
    );
}
```

## Complete Example: Research Assistant

Here's a comprehensive example combining multiple API features:

```javascript
module.exports = async (params) => {
    const { quickAddApi, app, variables } = params;
    
    try {
        // Get research parameters
        const topic = await quickAddApi.inputPrompt("Research Topic:");
        if (!topic) return;
        
        const sources = await quickAddApi.checkboxPrompt(
            ["Web Search", "Academic Papers", "Books", "Videos"],
            ["Web Search", "Academic Papers"]
        );
        
        // AI-assisted outline generation
        const { outline } = await quickAddApi.ai.prompt(
            `Create a research outline for: ${topic}`,
            "gpt-4",
            {
                variableName: "outline",
                shouldAssignVariables: true,
                modelOptions: { temperature: 0.7 }
            }
        );
        
        // Create folder structure
        const folder = `Research/${topic}`;
        
        // Check if folder exists before creating
        try {
            const folderExists = await app.vault.adapter.exists(folder);
            if (!folderExists) {
                await app.vault.createFolder(folder);
            }
        } catch (err) {
            console.error(`Failed to create folder: ${err}`);
            new Notice(`Failed to create research folder: ${err.message}`);
            return;
        }
        
        // Set variables for templates
        variables.topic = topic;
        variables.sources = sources.join(", ");
        variables.date = quickAddApi.date.now("YYYY-MM-DD HH:mm");
        variables.outline = outline;
        
        // Execute template choice
        await quickAddApi.executeChoice("Research Template", variables);
        
        // Show completion
        await quickAddApi.infoDialog(
            "Research Project Created",
            [
                `Topic: ${topic}`,
                `Sources: ${sources.length} selected`,
                `Location: ${folder}`,
                "AI outline generated successfully"
            ]
        );
        
    } catch (error) {
        console.error("Research assistant error:", error);
        new Notice(`Error: ${error.message}`);
    }
};
```

## Error Handling Best Practices

Always wrap API calls in try-catch blocks:

```javascript
module.exports = async (params) => {
    const { quickAddApi } = params;
    
    try {
        const input = await quickAddApi.inputPrompt("Enter value:");
        
        if (!input) {
            // User cancelled - handle gracefully
            return;
        }
        
        // Process input...
        
    } catch (error) {
        console.error("Script error:", error);
        
        await quickAddApi.infoDialog(
            "Error",
            `An error occurred: ${error.message}`
        );
    }
};
```

## Performance Tips

1. **Batch Operations**: Use loops wisely to avoid overwhelming the system
2. **Debounce User Input**: Add delays between rapid operations
3. **Check File Existence**: Verify files exist before operations
4. **Validate Input**: Always validate user input before processing

## Field Suggestions Module

Access via `quickAddApi.fieldSuggestions`:

### `getFieldValues(fieldName: string, options?: object): Promise<string[]>`
Retrieves all unique values for a specific field across your vault.

**Parameters:**
- `fieldName`: The name of the field to search for
- `options`: (Optional) Filtering options:
  - `folder`: Only search in specific folder (e.g., "daily/notes")
  - `tags`: Only search in files with specific tags (array)
  - `includeInline`: Include Dataview inline fields (default: false)

**Returns:** Promise resolving to sorted array of unique field values

**Examples:**

Basic usage:
```javascript
// Get all status values in vault
const statuses = await quickAddApi.fieldSuggestions.getFieldValues("status");
const selected = await quickAddApi.suggester(statuses, statuses);
```

With folder filter:
```javascript
// Get project types only from projects folder
const projectTypes = await quickAddApi.fieldSuggestions.getFieldValues(
    "type",
    { folder: "projects" }
);
```

With tag filter:
```javascript
// Get priorities from work-tagged files
const priorities = await quickAddApi.fieldSuggestions.getFieldValues(
    "priority",
    { tags: ["work", "important"] }
);
```

Include inline fields:
```javascript
// Get all client names including inline fields
const clients = await quickAddApi.fieldSuggestions.getFieldValues(
    "client",
    { 
        folder: "work/projects",
        includeInline: true 
    }
);
```

### `clearCache(fieldName?: string): void`
Clears the field suggestions cache for better performance.

**Parameters:**
- `fieldName`: (Optional) Specific field to clear, or clears all if omitted

**Example:**
```javascript
// Clear cache for specific field after bulk updates
await quickAddApi.fieldSuggestions.clearCache("status");

// Clear entire cache
await quickAddApi.fieldSuggestions.clearCache();
```

### Complete Field Management Example

```javascript
module.exports = async (params) => {
    const { quickAddApi, app, variables } = params;
    
    // Smart task creation with field suggestions
    const taskType = await quickAddApi.suggester(
        await quickAddApi.fieldSuggestions.getFieldValues("type", {
            folder: "tasks"
        }),
        await quickAddApi.fieldSuggestions.getFieldValues("type", {
            folder: "tasks"
        })
    );
    
    const priority = await quickAddApi.suggester(
        ["🔴 High", "🟡 Medium", "🟢 Low"],
        await quickAddApi.fieldSuggestions.getFieldValues("priority") || 
        ["high", "medium", "low"]
    );
    
    const assignee = await quickAddApi.suggester(
        await quickAddApi.fieldSuggestions.getFieldValues("assignee", {
            tags: ["person"],
            includeInline: true
        }),
        await quickAddApi.fieldSuggestions.getFieldValues("assignee", {
            tags: ["person"],
            includeInline: true
        })
    );
    
    // Create task with consistent field values
    variables.type = taskType;
    variables.priority = priority;
    variables.assignee = assignee;
    
    await quickAddApi.executeChoice("Create Task", variables);
};
```

## See Also

- [Macro Choices](./Choices/MacroChoice.md) - Using scripts in macros
- [Inline Scripts](./InlineScripts.md) - Using scripts in templates
- [Format Syntax](./FormatSyntax.md) - Template variables
- [Examples](./Examples/Macro_BookFinder.md) - Practical implementations