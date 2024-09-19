import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// eslint-disable-next-line react/prop-types
const PersonalModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState(initialData);

    // Este efecto es necesario para actualizar el formulario si se recibe nueva data
    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        // Simular función de crear o editar datos
        if (formData.id) {
            // Editar
            console.log("Editando personal:", formData);
            // Aquí iría el código para actualizar los datos en Supabase
        } else {
            // Crear
            console.log("Agregando nuevo personal:", formData);
            // Aquí iría el código para agregar datos a Supabase
        }
        onSubmit(); // Llamar la función proporcionada cuando se complete la acción
        onClose(); // Cerrar el modal
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{formData.id ? "Editar Personal" : "Agregar Personal"}</DialogTitle>
                </DialogHeader>
                <div>
                    <Input name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
                    <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                    {/* Añadir más campos según sea necesario */}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleSubmit}>Guardar</Button>
                    <Button variant="outline" onClick={onClose}>Cerrar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PersonalModal;
