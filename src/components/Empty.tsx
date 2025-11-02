import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Empty component
export function Empty() {
  return (
    <div className={cn("flex h-full items-center justify-center text-gray-400 dark:text-gray-500")} onClick={() => toast('Coming soon')}>
      <div className="text-center">
        <div className="mb-4 text-4xl">
          <i className="fa-solid fa-box-open"></i>
        </div>
        <p>暂无内容</p>
      </div>
    </div>
  );
}