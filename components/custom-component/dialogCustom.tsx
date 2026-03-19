"use client";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DialogOverview from "../main-component/dialogOverview";

interface ProductionDashboardDialogProps {
 typeDialog?: string;
 primaryKeyName?: string;
 productOptions?: { label: string; value: string }[];
}


export function ProductionDashboardDialog({ typeDialog, primaryKeyName, productOptions }: ProductionDashboardDialogProps) {


  return (
    <DialogContent className="sm:max-w-[95%] max-h-[95vh] overflow-y-auto  overflow-x-hidden">
      <form className="max-w-[90vw] mt-12 mx-auto">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription>
          </DialogDescription>
              </DialogHeader>
                <DialogOverview typeDialog={typeDialog} primaryKeyName={primaryKeyName} productOptions={productOptions} />
              <DialogFooter>
          <DialogClose asChild>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
