import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { FormBuilderProvider, useFormBuilder } from '@/contexts/FormBuilderContext';
import DesignerHeader from '@/components/FormBuilder/DesignerHeader';
import DesignerLayout from '@/components/FormBuilder/DesignerLayout';
import FormSettingsModal from '@/components/FormBuilder/FormSettingsModal';
import FieldConfigModal from '@/components/FormBuilder/FieldConfigModal';
import { useToast } from '@/hooks/use-toast';

const DesignerContent = () => {
  const { state, dispatch, createField } = useFormBuilder();
  const { formData, selectedField, isPreviewMode } = state;
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isFormSettingsOpen, setIsFormSettingsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadForm(id);
    }
  }, [id]);

  useEffect(() => {
    if (selectedField && !isPreviewMode) {
      setIsConfigModalOpen(true);
    }
  }, [selectedField, isPreviewMode]);

  const loadForm = async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}`);
      if (response.ok) {
        const form = await response.json();
        dispatch({ type: 'SET_FORM_DATA', payload: form });
      } else {
        toast({
          title: "Error",
          description: "Form not found",
          variant: "destructive"
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading form:', error);
      toast({
        title: "Error",
        description: "Failed to load form",
        variant: "destructive"
      });
    }
  };

  const saveForm = async () => {
    if (!id) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Form saved successfully"
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "Failed to save form",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id, event.active.data.current);
    dispatch({ type: 'SET_DRAGGING', payload: true });
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log('Drag over:', event.over?.id);
    // This handler is required for proper drag and drop functionality
    // It allows the drag operation to continue over droppable areas
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag ended:', event.active.id, event.over?.id, event.active.data.current);
    dispatch({ type: 'SET_DRAGGING', payload: false });
    
    const { active, over } = event;

    if (!over) {
      console.log('No drop target');
      return;
    }

    // Handle dropping from palette
    if (active.id.toString().startsWith('palette-')) {
      const fieldType = active.data.current?.type;
      console.log('Dropping field type:', fieldType, 'onto:', over.id);
      
      if (fieldType && over.id === 'form-canvas') {
        // Ensure the field type is valid
        const validFieldTypes = ['text', 'textarea', 'select', 'checkbox', 'radio'];
        if (validFieldTypes.includes(fieldType)) {
          const newField = createField(fieldType as any);
          console.log('Created new field:', newField);
          dispatch({ type: 'ADD_FIELD', payload: newField });
        } else {
          console.error('Invalid field type:', fieldType);
        }
      }
      return;
    }

    // Handle reordering existing fields
    if (over.id !== active.id) {
      const oldIndex = formData.fields.findIndex(field => field.id === active.id);
      const newIndex = formData.fields.findIndex(field => field.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedFields = arrayMove(formData.fields, oldIndex, newIndex);
        dispatch({ type: 'REORDER_FIELDS', payload: reorderedFields });
      }
    }
  };

  const togglePreview = () => {
    dispatch({ type: 'SET_PREVIEW_MODE', payload: !isPreviewMode });
    dispatch({ type: 'SELECT_FIELD', payload: null });
  };

  const updateFormMeta = (updates: { name: string; description: string }) => {
    dispatch({ type: 'UPDATE_FORM_META', payload: updates });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DesignerHeader
        formName={formData.name}
        formDescription={formData.description}
        formId={id}
        isPreviewMode={isPreviewMode}
        saving={saving}
        onTogglePreview={togglePreview}
        onSave={saveForm}
        onOpenSettings={() => setIsFormSettingsOpen(true)}
      />

      <DesignerLayout
        isPreviewMode={isPreviewMode}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      />

      <FieldConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          dispatch({ type: 'SELECT_FIELD', payload: null });
        }}
      />

      <FormSettingsModal
        isOpen={isFormSettingsOpen}
        formName={formData.name}
        formDescription={formData.description}
        onClose={() => setIsFormSettingsOpen(false)}
        onUpdate={updateFormMeta}
      />
    </div>
  );
};

const Designer = () => {
  return (
    <FormBuilderProvider>
      <DesignerContent />
    </FormBuilderProvider>
  );
};

export default Designer;
