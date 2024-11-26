/* eslint-disable react/prop-types */
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserIcon, BriefcaseIcon, MailIcon, CalendarIcon, LockIcon } from 'lucide-react'

const PersonalModal = ({ isOpen, onClose, initialData, accion, onSave }) => {
    const { register, handleSubmit, reset } = useForm()

    useEffect(() => {
        if (isOpen) {
            reset(initialData || {
                nombre: '',
                apellido: '',
                cargo: '',
                fecha_contratacion: '',
                email: '',
                password: ''
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
                    <DialogTitle>{accion === 'edit' ? "Editar Personal" : "Agregar Personal"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                    <FormInput
                        id="nombre"
                        label="Nombre"
                        icon={<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        placeholder="Nombre"
                    />
                    <FormInput
                        id="apellido"
                        label="Apellido"
                        icon={<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        placeholder="Apellido"
                    />
                    <FormInput
                        id="cargo"
                        label="Cargo"
                        icon={<BriefcaseIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        placeholder="Cargo en la biblioteca"
                    />
                    <FormInput
                        id="fecha_contratacion"
                        label="Fecha de Contratación"
                        icon={<CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        type="date"
                    />
                    <FormInput
                        id="email"
                        label="Email"
                        icon={<MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        type="email"
                        placeholder="correo@ejemplo.com"
                    />
                    <FormInput
                        id="password"
                        label="Contraseña"
                        icon={<LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                        type="password"
                        placeholder="Contraseña"
                    />
                    <Button type="submit" className="w-full">
                        Guardar Personal
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default PersonalModal

