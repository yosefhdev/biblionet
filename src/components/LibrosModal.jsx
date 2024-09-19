/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookIcon, UserIcon, BookmarkIcon, CalendarIcon, HashIcon, CopyIcon } from "lucide-react"

const LibrosModal = ({ isOpen, onClose, initialData, accion }) => {
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

    const FormInput = ({ id, label, icon, ...props }) => (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="relative">
                {icon}
                <Input id={id} {...register(id)} className="pl-10" required {...props} />
            </div>
        </div>
    )

    const currentYear = new Date().getFullYear()

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{accion == 'edit' ? "Editar Libro" : "Agregar Libro"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmitForm)} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center mb-6">Información del Libro</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <FormInput
                            id="titulo"
                            label="Título"
                            icon={<BookIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="Titulo del libro"
                        />
                        <FormInput
                            id="autor"
                            label="Autor"
                            icon={<UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="Autor del libro"
                        />
                        <FormInput
                            id="genero"
                            label="Género"
                            icon={<BookmarkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="Genero del libro"
                        />
                        <FormInput
                            id="anioPublicacion"
                            label="Año de Publicación"
                            icon={<CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            type="number"
                            placeholder="Año de publicación"
                            min="1000"
                            max={currentYear.toString()}
                        />
                        <FormInput
                            id="isbn"
                            label="ISBN"
                            icon={<HashIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            placeholder="978-0307474728"
                        // pattern="^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$"
                        />
                        <FormInput
                            id="copias"
                            label="Número de Copias"
                            icon={<CopyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />}
                            type="number"
                            placeholder="Número de copias"
                            min="0"
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

export default LibrosModal;
