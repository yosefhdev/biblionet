/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label"
import { UserIcon, UserPlusIcon, MapPinIcon, PhoneIcon, MailIcon } from "lucide-react"

const PersonalModal = ({ isOpen, onClose, initialData, accion }) => {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: initialData ?? {},
    });

    // Resetear el formulario cuando initialData cambie
    useEffect(() => {
        reset(initialData);
    }, [initialData, reset]);

    const onSubmitForm = async (data) => {
        // Simular función de crear o editar datos
        if (data.id) {
            console.log("Editando personal:", data);
            // Aquí iría el código para actualizar los datos en Supabase
        } else {
            console.log("Agregando Personal nuevo:", data);
            // Aquí iría el código para agregar datos a Supabase
        }
        onClose(); // Cerrar el modal
    };

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
                    <DialogTitle>{accion == 'edit' ? "Editar Personal" : "Agregar Personal"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Información del Personal</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <FormInput
                            id="nombre"
                            label="Nombre"
                            icon={<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="Nombre del personal"
                        />
                        <FormInput
                            id="apellido_p"
                            label="Apellido Paterno"
                            icon={<UserPlusIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="Apellido Paterno"
                        />
                        <FormInput
                            id="apellido_m"
                            label="Apellido Materno"
                            icon={<UserPlusIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="Apellido Materno"
                        />
                        <FormInput
                            id="direccion"
                            label="Dirección"
                            icon={<MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="Direccion"
                        />
                        <FormInput
                            id="telefono"
                            label="Telefono"
                            icon={<PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="Telefono"
                        />
                        <FormInput
                            id="correo"
                            label="Correo"
                            icon={<MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="Correo"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full mt-6"
                    >
                        Guardar Libro
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PersonalModal;
