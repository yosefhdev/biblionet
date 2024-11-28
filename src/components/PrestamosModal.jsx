/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarIcon, SearchIcon, XIcon, UserIcon, BookIcon } from 'lucide-react'
import { supabase } from "~/utils/supabase"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const PrestamosModal = ({ isOpen, onClose, onSave }) => {
    const { control, handleSubmit, reset, setValue, watch } = useForm()

    const [clientes, setClientes] = useState([])
    const [personal, setPersonal] = useState([])
    const [libros, setLibros] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTable, setActiveTable] = useState(null)

    const selectedCliente = watch('cliente_id')
    const selectedPersonal = watch('personal_id')
    const selectedLibros = watch('libros') || []

    useEffect(() => {
        if (isOpen) {
            fetchClientes()
            fetchPersonal()
            fetchLibros()
            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)
            reset({
                cliente_id: '',
                personal_id: '',
                fecha_prestamo: today.toISOString().split('T')[0],
                fecha_devolucion: tomorrow.toISOString().split('T')[0],
                libros: []
            })
        }
    }, [isOpen, reset])


    const fetchClientes = async () => {
        const { data, error } = await supabase
            .from('clientes')
            .select('id, nombre, apellido_paterno, apellido_materno, email')
        // console.log("🚀 ~ fetchClientes ~ data:", data)
        if (error) {
            console.log('error', error)
            setClientes([])
        } else {
            setClientes(data || [])
        }
    }

    const fetchPersonal = async () => {
        const { data, error } = await supabase
            .from('personal')
            .select('id, nombre, apellido')
        // console.log("🚀 ~ fetchPersonal ~ data:", data)
        if (error) {
            console.log('error', error)
            setPersonal([])
        } else {
            setPersonal(data || [])
        }
    }

    const fetchLibros = async () => {
        const { data, error } = await supabase
            .from('libros')
            .select('id, titulo, autor, copias')
        // console.log("🚀 ~ fetchLibros ~ data:", data)
        if (error) {
            console.log('error', error)
            setLibros([])
        } else {
            setLibros(data || [])
        }
    }

    const onSubmitForm = async (data) => {
        // Reducir la cantidad de copias para cada libro prestado
        for (const libro of data.libros) {
            const { error } = await supabase
                .from('libros')
                .update({ copias: libro.copias - 1 })
                .eq('id', libro.id)

            if (error) {
                console.error('Error al actualizar las copias del libro:', error)
                // Aquí podrías manejar el error, por ejemplo, mostrando un mensaje al usuario
            }
        }

        // Guardar el préstamo
        await onSave(data)
    }

    const filteredData = (data) => {
        return data.filter(item =>
            Object.values(item).some(val =>
                val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }

    const handleSelect = (type, item) => {
        if (type === 'clientes') {
            setValue('cliente_id', item)
        } else if (type === 'personal') {
            setValue('personal_id', item)
        } else if (type === 'libros') {
            const currentLibros = watch('libros') || []
            if (!currentLibros.some(libro => libro.id === item.id)) {
                setValue('libros', [...currentLibros, item])
            }
        }
        setActiveTable(null)
    }

    const removeLibro = (libroId) => {
        const currentLibros = watch('libros') || []
        setValue('libros', currentLibros.filter(libro => libro.id !== libroId))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] flex">
                <div className="flex-1 pr-4">
                    <DialogHeader>
                        <DialogTitle>Nuevo Préstamo</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Cliente</Label>
                            {selectedCliente ? (
                                <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <span>{`${selectedCliente.nombre} ${selectedCliente.apellido_paterno} ${selectedCliente.apellido_materno}`}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setValue('cliente_id', null)}
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setActiveTable('clientes')}
                                >
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    Seleccionar Cliente
                                </Button>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Personal</Label>
                            {selectedPersonal ? (
                                <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <span>{`${selectedPersonal.nombre} ${selectedPersonal.apellido}`}</span>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setValue('personal_id', null)}
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setActiveTable('personal')}
                                >
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    Seleccionar Personal
                                </Button>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Libros</Label>
                            {selectedLibros.length > 0 && (
                                <div className="space-y-2">
                                    {selectedLibros.map(libro => (
                                        <div key={libro.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                            <span>{libro.titulo}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeLibro(libro.id)}
                                            >
                                                <XIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => setActiveTable('libros')}
                            >
                                <BookIcon className="mr-2 h-4 w-4" />
                                Agregar Libro
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fecha_prestamo">Fecha de Préstamo</Label>
                            <Controller
                                name="fecha_prestamo"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <Input {...field} type="date" className="pl-10" defaultValue={new Date().toISOString().split('T')[0]} />
                                    </div>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fecha_devolucion">Fecha de Devolución</Label>
                            <Controller
                                name="fecha_devolucion"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <Input {...field} type="date" className="pl-10" defaultValue={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]} />
                                    </div>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Guardar Préstamo
                        </Button>
                    </form>
                </div>
                {activeTable && (
                    <div className="flex-1 pl-4 border-l">
                        <div className="mb-4">
                            <Label htmlFor="search">Buscar</Label>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {activeTable === 'clientes' && (
                                        <>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Email</TableHead>
                                        </>
                                    )}
                                    {activeTable === 'personal' && (
                                        <>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Apellido</TableHead>
                                        </>
                                    )}
                                    {activeTable === 'libros' && (
                                        <>
                                            <TableHead>Título</TableHead>
                                            <TableHead>Autor</TableHead>
                                            <TableHead>Disponibilidad</TableHead>
                                        </>
                                    )}
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData(activeTable === 'clientes' ? clientes : activeTable === 'personal' ? personal : libros).map((item) => (
                                    <TableRow key={item.id}>
                                        {activeTable === 'clientes' && (
                                            <>
                                                <TableCell>{`${item.nombre} ${item.apellido_paterno} ${item.apellido_materno}`}</TableCell>
                                                <TableCell>{item.email}</TableCell>
                                            </>
                                        )}
                                        {activeTable === 'personal' && (
                                            <>
                                                <TableCell>{item.nombre}</TableCell>
                                                <TableCell>{item.apellido}</TableCell>
                                            </>
                                        )}
                                        {activeTable === 'libros' && (
                                            <>
                                                <TableCell>{item.titulo}</TableCell>
                                                <TableCell>{item.autor}</TableCell>
                                                <TableCell>{item.copias} disponibles</TableCell>
                                            </>
                                        )}
                                        <TableCell>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleSelect(activeTable, item)}
                                                disabled={activeTable === 'libros' && item.copias === 0}
                                            >
                                                {activeTable === 'libros' && item.copias === 0 ? 'No disponible' : 'Seleccionar'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default PrestamosModal;
