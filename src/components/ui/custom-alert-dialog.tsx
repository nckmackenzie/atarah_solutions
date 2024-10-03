import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface CustomAlertDialogProps {
  children: React.ReactNode;
  prompt?: string;
  promptDescription?: boolean;
  description?: string;
  onConfirm?: () => void;
  isPending?: boolean;
}

export function CustomAlertDialog({
  children,
  prompt,
  promptDescription,
  onConfirm,
  description,
  isPending,
}: CustomAlertDialogProps) {
  function handleAction() {
    if (onConfirm) {
      onConfirm();
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {prompt || 'Are you absolutely sure?'}
          </AlertDialogTitle>
          {promptDescription && (
            <AlertDialogDescription>
              {description ||
                'This action cannot be undone. Are you sure you want to proceed?'}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAction}
            disabled={isPending}
            className="bg-rose-500 dark:bg-rose-800 text-slate-900 hover:bg-rose-600 dark:hover:bg-rose-900"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
