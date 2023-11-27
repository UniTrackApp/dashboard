import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "~/components/ui/separator";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-[30px] w-[200px]" />
      <Skeleton className="h-[40px] w-[600px]" />
      <Separator />
      <Skeleton className="h-[500px] w-full" />
    </div>
  );
}
