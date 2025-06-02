import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

type Props = {
  onConfirm: () => void;
  isGeneratingVoucher: boolean;
  disableVoucherGeneration: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
};

export const GenerateVoucherButton = ({
  onConfirm,
  isGeneratingVoucher,
  disableVoucherGeneration,
  isDialogOpen,
  setIsDialogOpen,
}: Props) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          className="px-4"
          disabled={disableVoucherGeneration}
        >
          {isGeneratingVoucher && (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          )}
          Generate Voucher
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Generation</DialogTitle>
          <DialogDescription>
            Are you sure you want to generate voucher(s) for the selected group
            members?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              setIsDialogOpen(false);
            }}
            disabled={isGeneratingVoucher}
          >
            {isGeneratingVoucher && (
              <Loader2 className="w-3 h-3 animate-spin mr-2" />
            )}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
