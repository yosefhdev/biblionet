/* eslint-disable react/prop-types */
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CambiarEstatusModal = ({ isOpen, onClose, onSave, currentStatus }) => {
    const [newStatus, setNewStatus] = useState(currentStatus)

    const handleSave = () => {
        onSave(newStatus)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cambiar Estatus del Préstamo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="estatus">Nuevo Estatus</Label>
                        <Select onValueChange={setNewStatus} defaultValue={currentStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estatus" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Pendiente">Pendiente</SelectItem>
                                <SelectItem value="Atrasado">Atrasado</SelectItem>
                                <SelectItem value="Completado">Completado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleSave} className="w-full">
                        Guardar Cambios
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CambiarEstatusModal
