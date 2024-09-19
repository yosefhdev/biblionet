import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmación</DialogTitle>
                </DialogHeader>
                <div>{message}</div>
                <DialogFooter>
                    <Button variant="outline" onClick={onConfirm}>Confirmar</Button>
                    <Button variant="outline" onClick={onClose}>Cancelar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationModal;
