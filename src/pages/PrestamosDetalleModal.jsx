/* eslint-disable react/prop-types */
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookIcon, CalendarIcon, UserIcon } from 'lucide-react'

const PrestamosDetalleModal = ({ isOpen, onClose, prestamo }) => {
    if (!prestamo) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Detalles del Préstamo</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    <div className="flex items-center">
                        <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
                        <span>Cliente: {prestamo.cliente_nombre}</span>
                    </div>
                    <div className="flex items-center">
                        <UserIcon className="mr-2 h-5 w-5 text-gray-500" />
                        <span>Personal: {prestamo.personal_nombre}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                        <span>Fecha de préstamo: {new Date(prestamo.fecha_prestamo).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-5 w-5 text-gray-500" />
                        <span>Fecha de devolución: {new Date(prestamo.fecha_devolucion).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-semibold mr-2">Estatus:</span>
                        <span className={`px-2 py-1 rounded-full text-sm ${prestamo.estatus === 'Pendiente' ? 'bg-yellow-200 text-yellow-800' :
                            prestamo.estatus === 'Atrasado' ? 'bg-red-200 text-red-800' :
                                'bg-green-200 text-green-800'
                            }`}>
                            {prestamo.estatus}
                        </span>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Libros prestados:</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {prestamo.libros.map((libro) => (
                                <div key={libro.id} className="flex items-center space-x-2">
                                    {libro.foto ? (
                                        <img src={libro.foto} alt={libro.titulo} className="w-16 h-20 object-cover rounded" />
                                    ) : (
                                        <div className="w-16 h-20 bg-gray-200 flex items-center justify-center rounded">
                                            <BookIcon className="h-8 w-8 text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-semibold">{libro.titulo}</p>
                                        <p className="text-sm text-gray-500">{libro.autor}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <Button onClick={onClose} className="w-full">Cerrar</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PrestamosDetalleModal;

