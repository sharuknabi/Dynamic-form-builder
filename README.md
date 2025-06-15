
# Dynamic Drag-and-Drop Form Builder

A beautiful, intuitive no-code form designer built with React, TypeScript, and Tailwind CSS. Create custom forms with drag-and-drop functionality, field configuration, and form validation.

## Features

- 🎨 **Visual Form Builder**: Drag and drop interface for creating forms
- 📝 **Multiple Field Types**: Text, textarea, select, checkbox, and radio fields
- ⚙️ **Field Configuration**: Customize labels, placeholders, validation, and options
- 👀 **Live Preview**: Real-time preview of your forms
- 💾 **Form Management**: Save, edit, and manage multiple forms
- ✅ **Form Validation**: Built-in validation with error handling
- 📱 **Responsive Design**: Works beautifully on all devices
- 🎯 **Form Submissions**: Collect and store form responses

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Drag & Drop**: @dnd-kit
- **Routing**: React Router DOM
- **State Management**: React Context + useReducer
- **Icons**: Lucide React
- **Notifications**: Sonner Toast

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Modern web browser

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage Guide

### Creating a New Form

1. **Start**: Click "Create New Form" on the homepage
2. **Design**: Drag field types from the palette to the canvas
3. **Configure**: Click on fields to customize their properties
4. **Preview**: Use the "Preview" button to test your form
5. **Save**: Click "Save" to store your form

### Available Field Types

- **Text Input**: Single-line text entry
- **Textarea**: Multi-line text entry
- **Select Dropdown**: Choose from predefined options
- **Checkbox**: Boolean true/false selection
- **Radio Group**: Single selection from multiple options

### Field Configuration Options

- **Label**: Display name for the field
- **Placeholder**: Helper text (for text fields)
- **Required**: Make field mandatory
- **Options**: Define choices (for select/radio fields)
- **Validation**: Set length and pattern requirements

### Form Management

- **Edit Forms**: Click "Edit" on any form card
- **Preview Forms**: Click "Preview" to test functionality
- **View Live**: Click "View Live" to see the public form
- **Form Settings**: Configure form name and description

## Architecture

### Components Structure

```
src/
├── components/
│   └── FormBuilder/
│       ├── FieldPalette.tsx      # Draggable field types
│       ├── FormCanvas.tsx        # Drop zone for form building
│       ├── SortableFormField.tsx # Individual form fields
│       ├── FormFieldRenderer.tsx # Field rendering logic
│       └── FieldConfigModal.tsx  # Field configuration dialog
├── contexts/
│   └── FormBuilderContext.tsx    # Global state management
├── pages/
│   ├── Index.tsx                 # Homepage with form list
│   ├── Designer.tsx              # Form builder interface
│   └── FormPreview.tsx           # Form display and submission
└── api/
    ├── index.ts                  # API route handlers
    └── forms.ts                  # Form data management
```

### State Management

The application uses React Context with useReducer for state management:

- **Form Data**: Current form structure and fields
- **Selected Field**: Currently selected field for editing
- **Preview Mode**: Toggle between edit and preview modes
- **Drag State**: Track drag and drop operations

### API Endpoints

The application includes a mock API that simulates backend functionality:

- `GET /api/forms` - List all forms
- `POST /api/forms` - Create a new form
- `GET /api/forms/:id` - Get specific form
- `PUT /api/forms/:id` - Update form
- `POST /api/forms/:id/submit` - Submit form data
- `GET /api/forms/:id/submissions` - Get form submissions

## Customization

### Adding New Field Types

1. Add the field type to the `FormField` interface in `FormBuilderContext.tsx`
2. Add rendering logic in `FormFieldRenderer.tsx`
3. Add the field type to the palette in `FieldPalette.tsx`
4. Update the `createField` function for default properties

### Styling

The application uses Tailwind CSS with the shadcn/ui design system. Customize:

- Colors: Edit CSS variables in `src/index.css`
- Components: Modify shadcn/ui components
- Layout: Adjust Tailwind classes

### Validation Rules

Add custom validation in `FormPreview.tsx`:

```typescript
// Example: Email validation
if (field.type === 'text' && field.label.includes('Email')) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    newErrors[field.id] = 'Please enter a valid email address';
  }
}
```

## Production Deployment

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Backend Integration

For production use, replace the mock API with a real backend:

1. **Database**: Use PostgreSQL, MongoDB, or your preferred database
2. **Server**: Implement with Node.js/Express, Python/FastAPI, or similar
3. **Authentication**: Add user management and form ownership
4. **File Storage**: Handle file uploads if needed

### Recommended Backend Schema

```sql
-- Forms table
CREATE TABLE forms (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY,
  form_id UUID REFERENCES forms(id),
  values JSONB NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW()
);
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open a GitHub issue or contact the development team.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
