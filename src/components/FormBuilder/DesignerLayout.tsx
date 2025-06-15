
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FieldPalette from './FieldPalette';
import FormCanvas from './FormCanvas';

interface DesignerLayoutProps {
  isPreviewMode: boolean;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

const DesignerLayout: React.FC<DesignerLayoutProps> = ({
  isPreviewMode,
  onDragStart,
  onDragOver,
  onDragEnd
}) => {
  return (
    <DndContext
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-[calc(100vh-80px)]">
        {!isPreviewMode && (
          <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
            <FieldPalette />
          </div>
        )}

        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isPreviewMode ? 'Form Preview' : 'Form Builder'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormCanvas />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default DesignerLayout;
