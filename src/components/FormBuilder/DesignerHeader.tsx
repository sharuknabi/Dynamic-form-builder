
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Save, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DesignerHeaderProps {
  formName: string;
  formDescription: string;
  formId?: string;
  isPreviewMode: boolean;
  saving: boolean;
  onTogglePreview: () => void;
  onSave: () => void;
  onOpenSettings: () => void;
}

const DesignerHeader: React.FC<DesignerHeaderProps> = ({
  formName,
  formDescription,
  formId,
  isPreviewMode,
  saving,
  onTogglePreview,
  onSave,
  onOpenSettings
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{formName}</h1>
            <p className="text-sm text-gray-500">{formDescription}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={onOpenSettings}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button
            variant="outline"
            onClick={onTogglePreview}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            onClick={onSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/forms/${formId}`)}
          >
            View Live
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DesignerHeader;
