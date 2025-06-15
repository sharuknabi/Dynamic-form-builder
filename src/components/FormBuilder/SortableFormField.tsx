
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormField, useFormBuilder } from '@/contexts/FormBuilderContext';
import FormFieldRenderer from './FormFieldRenderer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Trash2, GripVertical } from 'lucide-react';

interface SortableFormFieldProps {
  field: FormField;
}

const SortableFormField: React.FC<SortableFormFieldProps> = ({ field }) => {
  const { state, dispatch } = useFormBuilder();
  const { selectedField, isPreviewMode } = state;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSelected = selectedField?.id === field.id;

  const handleSelect = () => {
    if (!isPreviewMode) {
      dispatch({ type: 'SELECT_FIELD', payload: field });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_FIELD', payload: field.id });
  };

  if (isPreviewMode) {
    return (
      <div ref={setNodeRef} style={style}>
        <FormFieldRenderer field={field} />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-50' : ''}>
      <Card
        className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'
        }`}
        onClick={handleSelect}
      >
        <div className="flex items-start space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="mt-1 p-1 hover:bg-gray-100 rounded cursor-grab"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex-1">
            <FormFieldRenderer field={field} />
          </div>

          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelect}
              className="p-1 h-8 w-8"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="p-1 h-8 w-8 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SortableFormField;
