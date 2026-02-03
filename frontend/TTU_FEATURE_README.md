# TTU Management Feature

Complete implementation of the TTU (Tugas Takhir Unjuk) Management system with Upload and Review features.

## 🎯 Features Implemented

### 1. **Global State Management** (`TTUContext.jsx`)

- Context provider for managing TTU state across components
- State includes:
  - `currentStage`: Current TTU phase (1, 2, or 3)
  - `chatHistory`: Array of messages between student and lecturer
  - `submittedFile`: Currently submitted file for review
- Functions: `addMessage()`, `submitFile()`, `cancelSubmission()`, `nextStage()`

### 2. **Upload TTU Component** (`UploadTTU.jsx`)

✅ **Dynamic Stage Title**: Automatically shows "Upload TTU - Tahap X" based on current stage
✅ **Drag & Drop Interface**: Beautiful dropzone with hover states
✅ **File Handling**:

- File preview card with name, size, and type
- Preview button (mock action with alert)
- Remove button to clear selection
  ✅ **Submission Flow**:
- "Kirim" button submits file to chat history
- Automatically switches to Review tab
- Post-submission: Shows submitted file with "Cancel Submission" option
  ✅ **File Validation**: Supports PDF, DOC, DOCX, PPT, PPTX (max 10MB)

### 3. **Review Chat Component** (`ReviewChat.jsx`)

✅ **Chat Interface**:

- Scrollable chat container (600px height)
- Auto-scrolls to bottom on new messages
  ✅ **Message Bubbles**:
- Student messages: Right-aligned, blue background, white text
- Lecturer messages: Left-aligned, gray background, dark text
- Distinct avatars for student vs lecturer
  ✅ **File Bubbles**:
- Special styling for file attachments
- Download button (mock action)
- Shows file name and size
  ✅ **Text Input**: Bottom input field with Send button

### 4. **Main Page** (`TTUManagement.jsx`)

✅ **Tab Navigation**: Switch between "Upload TTU" and "Review & Bimbingan"
✅ **Clean Header**: With logo, title, and breadcrumb
✅ **Responsive Layout**: Max-width container with proper spacing
✅ **Info Footer**: Important notes for users

## 🎨 Design System

**Colors:**

- Primary: `bg-blue-600` (#2563EB)
- Background: `bg-gray-50`
- Cards: `bg-white shadow-sm rounded-xl`
- Accents: Gradient from blue-600 to indigo-600

**Typography:**

- Sans-serif (Inter/Roboto style via Tailwind)
- Headings: Font-bold, varying sizes
- Body: Font-medium/normal

**Components:**

- Rounded corners (rounded-lg, rounded-xl)
- Subtle shadows (shadow-sm, shadow-md)
- Smooth transitions
- Hover states on all interactive elements

## 🚀 Usage

### Basic Implementation:

```jsx
import TTUManagement from "./pages/TTUManagement";

function App() {
  return <TTUManagement />;
}
```

### With Router:

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TTUManagement from "./pages/TTUManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ttu" element={<TTUManagement />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 📦 Dependencies Required

```json
{
  "dependencies": {
    "react": "^18.x",
    "lucide-react": "^0.x"
  }
}
```

Install Lucide React icons:

```bash
npm install lucide-react
```

## 🔄 Interaction Flow

1. **Upload File:**
   - User drags/drops or selects file
   - Preview card appears with file details
   - Click "Kirim" to submit
   - Automatically switches to Review tab

2. **View in Chat:**
   - Submitted file appears as latest message in chat
   - Shows as downloadable attachment
   - Student can add text replies

3. **Cancel Submission:**
   - Click "Batalkan Pengajuan" button
   - Confirmation dialog appears
   - After confirmation, can upload new file

4. **Stage Progression:**
   - Use context's `nextStage()` to move to next phase
   - UI automatically updates to show new stage number

## 🎯 Demo State

The context comes with pre-populated demo messages:

- Welcome message from lecturer
- Student reply
- You can add more by modifying `TTUContext.jsx`

## ✨ Key Features

- ✅ **Fully Functional**: All interactions work (drag-drop, send, upload)
- ✅ **Clean Code**: Well-organized, documented components
- ✅ **Tailwind Styled**: Modern, responsive design
- ✅ **Lucide Icons**: Beautiful, consistent iconography
- ✅ **Context API**: Proper state management
- ✅ **Production Ready**: Can be integrated with real backend

## 🔗 Integration Points

To connect with real backend:

1. Replace `submitFile()` in context with API call
2. Replace `addMessage()` with socket/polling for real-time chat
3. Add authentication checks
4. Replace mock download/preview with actual file handling

Enjoy your new TTU Management system! 🎓
