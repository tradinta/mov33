import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PermissionDenied() {
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
            <ShieldAlert className="w-12 h-12 text-destructive" />
        </div>
        <CardTitle className="mt-4 text-2xl font-headline text-destructive">Permission Denied</CardTitle>
        <CardDescription>
          You do not have the necessary permissions to access this page or perform this action.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground space-y-2 text-center">
            <p>If you believe this is an error, please contact your system administrator or check if you are logged into the correct account.</p>
        </div>
      </CardContent>
    </Card>
  );
}
