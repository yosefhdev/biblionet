import DataTable from "@/components/DataTable"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from 'lucide-react'
import { useEffect, useState } from "react"
import LibrosModal from "~/components/LibrosModal"
import { supabase } from "~/utils/supabase"

const columnsLibros = [
    { accessorKey: "foto", header: "Imagen", cell: "image" },
    // { accessorKey: "id", header: "ID", cell: "id" },
    { accessorKey: "titulo", header: "Título", cell: "text" },
    { accessorKey: "autor", header: "Autor", cell: "text" },
    { accessorKey: "genero", header: "Género", cell: "text" },
    { accessorKey: "anio_publicacion", header: "Año de publicación", cell: "text" },
    { accessorKey: "isbn", header: "ISBN", cell: "text" },
    { accessorKey: "copias", header: "Copias", cell: "text" },
]

export function LibrosMenu() {
    const [dataLibros, setDataLibros] = useState([])
    const [showLibrosModal, setShowLibrosModal] = useState(false)
    const [selectedLibro, setSelectedLibro] = useState(null)
    const [accion, setAccion] = useState("add")
    const [isLoading, setIsLoading] = useState(true)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [libroToDelete, setLibroToDelete] = useState(null)

    useEffect(() => {
        fetchLibros()
    }, [])

    const fetchLibros = async () => {
        const { data, error } = await supabase.from('libros').select('*').order('id', { ascending: true })
        if (error) {
            console.log('error', error)
            setDataLibros([])
        } else {
            setDataLibros(data)
        }

        setIsLoading(false)
    }


    const handleAdd = () => {
        setAccion("add")
        setSelectedLibro(null)
        setShowLibrosModal(true)
    }

    const handleEdit = (editedItem) => {
        setAccion("edit")
        setSelectedLibro(editedItem)
        setShowLibrosModal(true)
    }

    const handleDeleteConfirmation = (libro) => {
        setLibroToDelete(libro)
        setShowDeleteDialog(true)
    }

    const handleDelete = async () => {
        if (libroToDelete) {
            setIsLoading(true)
            const { error } = await supabase.from('libros').delete().eq('id', libroToDelete.id)
            if (error) {
                console.log('Error deleting book:', error)
            } else {
                setDataLibros(dataLibros.filter(item => item.id !== libroToDelete.id))
            }
            setIsLoading(false)
            setShowDeleteDialog(false)
            setLibroToDelete(null)
        }
    }

    const handleSave = async (data) => {
        const { titulo, autor, genero, anio_publicacion, isbn, copias } = data
        const bookData = { titulo, autor, genero, anio_publicacion, isbn, copias }

        if (accion === "add") {
            const { data: newBook, error } = await supabase
                .from('libros')
                .insert(bookData)
                .select()
            if (error) {
                console.log('Error adding book:', error)
            } else {
                setDataLibros([...dataLibros, newBook[0]])
            }
        } else {
            const { error } = await supabase
                .from('libros')
                .update(bookData)
                .eq('id', data.id)
            if (error) {
                console.log('Error updating book:', error)
            } else {
                setDataLibros(dataLibros.map(item => item.id === data.id ? { ...item, ...bookData } : item))
            }
        }
        setShowLibrosModal(false)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Libros</CardTitle>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar libro
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : dataLibros.length > 0 ? (
                    <DataTable
                        data={dataLibros}
                        columns={columnsLibros}
                        headers={Object.keys(dataLibros[0]).filter(key => key !== 'id')}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDeleteConfirmation}
                    />
                ) : (
                    <div className="text-center text-muted-foreground">No hay libros registrados</div>
                )}
            </CardContent>
            <LibrosModal
                isOpen={showLibrosModal}
                onClose={() => setShowLibrosModal(false)}
                initialData={selectedLibro}
                accion={accion}
                onSave={handleSave}
            />
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente el libro
                            &quot;{libroToDelete?.titulo}&quot; de la base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}
