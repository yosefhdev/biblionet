/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PrestamosModal = ({ isOpen, onClose, initialData, accion }) => {
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
            console.log("Editando libro:", data);
            // Aquí iría el código para actualizar los datos en Supabase
        } else {
            console.log("Agregando nuevo libro:", data);
            // Aquí iría el código para agregar datos a Supabase
        }
        onClose(); // Cerrar el modal
    };

    // https://chatgpt.com/c/673fce33-a9d0-8000-ad11-0c44f24a9c4a
    // Seguir ese chat para completar este modal

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
                    <DialogTitle>{accion == 'edit' ? "Editar Libro" : "Agregar Libro"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Información del Libro</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {/* Formulario Aqui */}
                        
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

export default PrestamosModal;
