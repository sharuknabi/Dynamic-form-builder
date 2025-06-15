
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useFormBuilder } from '@/contexts/FormBuilderContext';
import SortableFormField from './SortableFormField';

const FormCanvas = () => {
  const { state } = useFormBuilder();
  const { formData, isDragging } = state;

  const { isOver, setNodeRef } = useDroppable({
    id: 'form-canvas'
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-96 p-6 border-2 border-dashed rounded-lg transition-all duration-200 ${
        isOver || isDragging
          ? 'border-blue-400 bg-blue-50'
          : formData.fields.length === 0
          ? 'border-gray-300 bg-gray-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      {formData.fields.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Start building your form</h3>
          <p className="text-gray-500">Drag field types from the palette to add them to your form</p>
        </div>
      ) : (
        <SortableContext items={formData.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {formData.fields.map((field) => (
              <SortableFormField key={field.id} field={field} />
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
};

export default FormCanvas;
