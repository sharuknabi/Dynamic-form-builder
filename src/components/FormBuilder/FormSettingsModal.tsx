
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormSettingsModalProps {
  isOpen: boolean;
  formName: string;
  formDescription: string;
  onClose: () => void;
  onUpdate: (updates: { name: string; description: string }) => void;
}

const FormSettingsModal: React.FC<FormSettingsModalProps> = ({
  isOpen,
  formName,
  formDescription,
  onClose,
  onUpdate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Form Name</label>
            <Input
              value={formName}
              onChange={(e) => onUpdate({ name: e.target.value, description: formDescription })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={formDescription}
              onChange={(e) => onUpdate({ name: formName, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onClose}>
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormSettingsModal;
