
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { FormField, useFormBuilder } from '@/contexts/FormBuilderContext';
import { Plus, Trash2 } from 'lucide-react';

interface FieldConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FieldConfigModal: React.FC<FieldConfigModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useFormBuilder();
  const { selectedField } = state;

  const [fieldData, setFieldData] = useState<FormField | null>(null);

  useEffect(() => {
    if (selectedField) {
      setFieldData({ ...selectedField });
    }
  }, [selectedField]);

  const handleSave = () => {
    if (fieldData) {
      dispatch({ type: 'UPDATE_FIELD', payload: fieldData });
      onClose();
    }
  };

  const updateField = (updates: Partial<FormField>) => {
    if (fieldData) {
      setFieldData({ ...fieldData, ...updates });
    }
  };

  const addOption = () => {
    if (fieldData && fieldData.options) {
      updateField({
        options: [...fieldData.options, `Option ${fieldData.options.length + 1}`]
      });
    }
  };

  const removeOption = (index: number) => {
    if (fieldData && fieldData.options) {
      updateField({
        options: fieldData.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    if (fieldData && fieldData.options) {
      const newOptions = [...fieldData.options];
      newOptions[index] = value;
      updateField({ options: newOptions });
    }
  };

  if (!fieldData) return null;

  const needsOptions = fieldData.type === 'select' || fieldData.type === 'radio';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Field</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Label */}
          <div>
            <Label htmlFor="field-label">Label</Label>
            <Input
              id="field-label"
              value={fieldData.label}
              onChange={(e) => updateField({ label: e.target.value })}
              placeholder="Enter field label"
            />
          </div>

          {/* Placeholder (for text inputs) */}
          {(fieldData.type === 'text' || fieldData.type === 'textarea') && (
            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={fieldData.placeholder || ''}
                onChange={(e) => updateField({ placeholder: e.target.value })}
                placeholder="Enter placeholder text"
              />
            </div>
          )}

          {/* Required */}
          <div className="flex items-center justify-between">
            <Label htmlFor="field-required">Required field</Label>
            <Switch
              id="field-required"
              checked={fieldData.required}
              onCheckedChange={(checked) => updateField({ required: checked })}
            />
          </div>

          {/* Options (for select and radio) */}
          {needsOptions && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Option
                </Button>
              </div>
              <Card>
                <CardContent className="p-3 space-y-2">
                  {fieldData.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {fieldData.options!.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="p-2 hover:bg-red-100 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FieldConfigModal;
