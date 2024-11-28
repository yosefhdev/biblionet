/* eslint-disable react/prop-types */
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpenIcon, CalendarIcon } from "lucide-react"
import { HiOutlineHashtag } from "react-icons/hi";
const InfoLibroModal = ({ isOpen, onClose, book }) => {
    console.log("🚀 ~ InfoLibroModal ~ book:", book)
    if (!book) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{book.titulo}</DialogTitle>
                    <DialogDescription>por {book.autor}</DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    <div className="flex justify-center">
                        {book.foto ? (
                            <img
                                src={book.foto}
                                alt={`Portada de ${book.titulo}`}
                                width={200}
                                height={300}
                                className="object-cover rounded-md"
                            />
                        ) : (
                            <div className="w-[200px] h-[300px] bg-gray-200 flex items-center justify-center rounded-md">
                                <BookOpenIcon className="h-16 w-16 text-gray-400" />
                            </div>
                        )}
                        
                    </div>
                    <div className="flex items-center">
                        <BookOpenIcon className="mr-2 h-5 w-5 text-gray-500" />
                        <span>Género: {book.genero}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                        <span>Año de publicación: {book.anio_publicacion}</span>
                    </div>
                    <div className="flex items-center">
                        <HiOutlineHashtag className="mr-2 h-5 w-5 text-gray-500" />
                        <span>ISBN: {book.isbn}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        Copias disponibles: {book.copias}
                    </p>
                </div>
                <div className="mt-6">
                    <Button onClick={onClose} className="w-full">Cerrar</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default InfoLibroModal;

