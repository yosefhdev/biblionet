/* eslint-disable react/prop-types */
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react'

const ClientesModal = ({ isOpen, onClose, initialData, accion, onSave }) => {
    const { register, handleSubmit, reset } = useForm()

    useEffect(() => {
        if (isOpen) {
            reset(initialData || {
                nombre: '',
                apellido_paterno: '',
                apellido_materno: '',
                direccion: '',
                telefono: '',
                email: ''
            })
        }
    }, [isOpen, initialData, reset])

    const onSubmitForm = async (data) => {
        await onSave(data)
    }

    const FormInput = ({ id, label, icon, ...props }) => (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                {icon}
                <Input id={id} {...register(id)} className="pl-10" required {...props} />
            </div>
        </div>
    )

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{accion === 'edit' ? "Editar Cliente" : "Agregar Cliente"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                    <FormInput
                        id="nombre"
                        label="Nombre"
                        icon={<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        placeholder="Nombre"
                    />
                    <FormInput
                        id="apellido_paterno"
                        label="Apellido Paterno"
                        icon={<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        placeholder="Apellido Paterno"
                    />
                    <FormInput
                        id="apellido_materno"
                        label="Apellido Materno"
                        icon={<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        placeholder="Apellido Materno"
                    />
                    <FormInput
                        id="direccion"
                        label="Dirección"
                        icon={<MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        placeholder="Dirección"
                    />
                    <FormInput
                        id="telefono"
                        label="Teléfono"
                        icon={<PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        type="number"
                        placeholder="Número de teléfono"
                    />
                    <FormInput
                        id="email"
                        label="Email"
                        icon={<MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        type="email"
                        placeholder="correo@ejemplo.com"
                    />
                    <Button type="submit" className="w-full">
                        Guardar Cliente
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ClientesModal

