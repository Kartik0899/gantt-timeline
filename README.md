# Gantt Timeline

A modern, interactive Gantt timeline application built with Next.js, React, and TypeScript. This application allows you to visualize and manage project timelines with tasks organized into lanes (teams or categories).

## 🚀 Features

### Core Functionality

- **Dual View Modes**

  - **Week View**: Detailed daily view with 80px per day
  - **Month View**: Compact weekly view with 20px per week
  - Toggle between views seamlessly

- **Task Management**

  - ✅ **Create Tasks**: Add new tasks via modal with custom name, dates, and assignee
  - ✏️ **Edit Tasks**: Click on any task to open the edit panel
  - 🗑️ **Delete Tasks**: Remove tasks with confirmation dialog
  - 📝 **Task Details**: Each task displays name and assignee

- **Interactive Drag & Drop**

  - **Horizontal Dragging**: Drag tasks left/right to change start and end dates
  - **Lane Switching**: Drag tasks vertically between lanes (e.g., from Team A to Team B)
  - Smooth animations and visual feedback during drag operations

- **Visual Indicators**

  - **Conflict Detection**: Tasks with overlapping dates show a warning indicator (⚠️)
  - **Today Marker**: Red vertical line indicating the current date
  - **Grid Lines**: Horizontal and vertical grid lines for better date alignment
  - **Hover Tooltips**: Detailed task information on hover (positioned dynamically based on lane)

- **Timeline Features**

  - **Synchronized Scrolling**: Date axis scrolls in sync with timeline content
  - **Sticky Headers**: Lane labels and date axis remain visible while scrolling
  - **Dynamic Range**: Timeline automatically adjusts to show all tasks with padding
  - **Full Coverage**: Grid lines extend to cover all dates in the visible range

- **Theme Support**

  - 🌙 **Dark Mode**: Default theme (dark mode enabled by default)
  - ☀️ **Light Mode**: Toggle to light theme
  - 💾 **Persistent**: Theme preference saved in localStorage

- **Data Management**

  - 💾 **Auto-Save**: Changes automatically saved to localStorage
  - 📤 **Export**: Export timeline data as JSON file
  - 📥 **Import**: Import timeline data from JSON file

- **Accessibility**
  - Keyboard navigation support
  - ARIA labels and roles
  - Screen reader friendly

## 🛠️ Tech Stack

- **Next.js 13.5.6** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.4.2** - Type safety
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **date-fns 2.30.0** - Date manipulation utilities
- **@dnd-kit** - Drag and drop functionality

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## 🏃 How to Run

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd gantt-timeline
```

2. Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The development server supports hot-reload, so changes will be reflected automatically.

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
gantt-timeline/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   └── page.tsx           # Main timeline page
├── components/
│   ├── panel/
│   │   └── TaskPanel.tsx  # Task creation/editing modal
│   ├── timeline/
│   │   ├── Axis.tsx       # Date axis component
│   │   ├── Grid.tsx       # Background grid lines
│   │   ├── Lane.tsx       # Lane container for tasks
│   │   ├── TaskBar.tsx    # Individual task bar
│   │   └── TodayMarker.tsx # Today indicator
│   └── UI/
│       └── Toggle.tsx     # Week/Month view toggle
├── data/
│   └── seed.json          # Initial seed data
├── lib/
│   ├── date.ts            # Date utility functions
│   ├── overlap.ts         # Conflict detection logic
│   └── storage.ts         # localStorage utilities
├── styles/
│   └── globals.css        # Global styles and Tailwind directives
└── public/                # Static assets
```

## 🎨 Key Features Explained

### View Modes

- **Week View**: Displays each day as a column (80px wide), perfect for detailed daily planning
- **Month View**: Shows each week as a column (20px wide), ideal for high-level overview

### Task Operations

1. **Adding a Task**: Click "Add Task" → Modal opens → Enter task details → Click "Create Task"
2. **Editing a Task**: Click on any task bar → Edit in panel → Click "Save"
3. **Deleting a Task**: Edit a task → Click "Delete" → Confirm deletion
4. **Moving Tasks**:
   - Drag horizontally to change dates
   - Use the lane-switch handle (icon) to drag between lanes

### Data Persistence

- All changes are automatically saved to browser localStorage
- Use Export/Import buttons in the header to backup or share your timeline data

## 🎯 Usage Tips

1. **Navigating the Timeline**: Scroll horizontally to view different date ranges
2. **Changing Dates**: Drag tasks left or right to adjust start/end dates
3. **Organizing Tasks**: Drag tasks between lanes to reorganize your team structure
4. **Viewing Conflicts**: Look for red warning indicators on overlapping tasks
5. **Theme Switching**: Use the sun/moon icon in the header to toggle between dark and light modes

## 🔧 Configuration

### Dark Mode

Dark mode is enabled by default. The preference is stored in `localStorage` with the key `"theme"`.

To change the default theme, modify `app/page.tsx`:

```typescript
const [isDarkMode, setIsDarkMode] = useState(true); // Change to false for light default
```

### Customization

- **Colors**: Modify `tailwind.config.js` to change brand colors
- **Day Width**: Adjust `dayWidth` values in `app/page.tsx`:
  - Week view: `80` (px)
  - Month view: `20` (px)

## 📝 License

This project is private and for personal/assignment use.

## 🤝 Contributing

This is an assignment project. For questions or improvements, please contact the repository owner.

---

Built with ❤️ using Next.js and React
