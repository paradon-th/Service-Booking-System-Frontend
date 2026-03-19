import { BellIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Notifications = () => {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost" className="relative">
          <BellIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={isMobile ? "center" : "end"} className="w-72 p-4 text-sm">
        <DropdownMenuLabel className="px-0 pb-2 text-base font-medium">
          Notifications
        </DropdownMenuLabel>
        <p className="text-muted-foreground">
          Notification feed will appear here once the migration connects to real data.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notifications;
