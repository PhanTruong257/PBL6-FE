import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataChangeViewerProps {
  oldData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  changes?: Record<string, unknown>;
}

export function DataChangeViewer({ oldData, newData, changes }: DataChangeViewerProps) {
  // Get all unique keys from both old and new data
  const allKeys = new Set([
    ...Object.keys(oldData || {}),
    ...Object.keys(newData || {}),
  ]);

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const hasChanged = (key: string): boolean => {
    const oldVal = oldData?.[key];
    const newVal = newData?.[key];
    return JSON.stringify(oldVal) !== JSON.stringify(newVal);
  };

  if (!oldData && !newData) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-muted-foreground text-center">Không có dữ liệu thay đổi</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Dữ liệu thay đổi</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Changes Summary */}
        {changes && Object.keys(changes).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Tóm tắt thay đổi:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.keys(changes).map((key) => (
                <Badge key={key} variant="secondary">
                  {key}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Side by side comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Old Data */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-red-600">Dữ liệu cũ</h4>
            <ScrollArea className="h-[300px] rounded-md border p-4 bg-red-50/50">
              <div className="space-y-2">
                {[...allKeys].map((key) => {
                  const value = oldData?.[key];
                  const changed = hasChanged(key);
                  return (
                    <div
                      key={key}
                      className={`text-sm ${changed ? 'bg-red-100 p-1 rounded' : ''}`}
                    >
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <pre className="text-xs mt-1 whitespace-pre-wrap">
                        {formatValue(value)}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* New Data */}
          <div>
            <h4 className="text-sm font-medium mb-2 text-green-600">Dữ liệu mới</h4>
            <ScrollArea className="h-[300px] rounded-md border p-4 bg-green-50/50">
              <div className="space-y-2">
                {[...allKeys].map((key) => {
                  const value = newData?.[key];
                  const changed = hasChanged(key);
                  return (
                    <div
                      key={key}
                      className={`text-sm ${changed ? 'bg-green-100 p-1 rounded' : ''}`}
                    >
                      <span className="font-medium text-muted-foreground">{key}:</span>
                      <pre className="text-xs mt-1 whitespace-pre-wrap">
                        {formatValue(value)}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Inline comparison for changed fields */}
        {changes && Object.keys(changes).length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Chi tiết thay đổi:</h4>
            <div className="space-y-2">
              {Object.entries(changes).map(([key, change]) => {
                const changeObj = change as { from?: unknown; to?: unknown };
                return (
                  <div
                    key={key}
                    className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50"
                  >
                    <span className="font-medium min-w-[100px]">{key}:</span>
                    <span className="text-red-600">{formatValue(changeObj?.from)}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-green-600">{formatValue(changeObj?.to)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
