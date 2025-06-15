
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDraggable } from '@dnd-kit/core';
import { FormField } from '@/contexts/FormBuilderContext';
import { Type, FileText, ChevronDown, CheckSquare, Radio } from 'lucide-react';

const fieldTypes = [
  {
    type: 'text' as const,
    icon: Type,
    label: 'Text Input',
    description: 'Single line text field'
  },
  {
    type: 'textarea' as const,
    icon: FileText,
    label: 'Textarea',
    description: 'Multi-line text field'
  },
  {
    type: 'select' as const,
    icon: ChevronDown,
    label: 'Select Dropdown',
    description: 'Choose from options'
  },
  {
    type: 'checkbox' as const,
    icon: CheckSquare,
    label: 'Checkbox',
    description: 'True/false option'
  },
  {
    type: 'radio' as const,
    icon: Radio,
    label: 'Radio Group',
    description: 'Choose one option'
  }
];

const DraggableFieldType = ({ type, icon: Icon, label, description }: typeof fieldTypes[0]) => {
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: `palette-${type}`,
    data: { type }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 select-none ${
        isDragging ? 'opacity-50 scale-95 z-50' : ''
      }`}
    >
      <div className="flex items-center space-x-3 pointer-events-none">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{label}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

const FieldPalette = () => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Field Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {fieldTypes.map((fieldType) => (
          <DraggableFieldType key={fieldType.type} {...fieldType} />
        ))}
      </CardContent>
    </Card>
  );
};

export default FieldPalette;
