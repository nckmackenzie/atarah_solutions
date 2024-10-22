export default function CustomFormMessage({ message }: { message: string }) {
  return <p className="text-xs text-destructive">{message}</p>;
}
