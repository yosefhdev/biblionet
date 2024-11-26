import { useState, useEffect } from "react"
import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2 } from 'lucide-react'
import PersonalModal from "~/components/PersonalModal"
import { supabase } from "~/utils/supabase"
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

const columnsPersonal = [
    { accessorKey: "id", header: "ID", cell: "id" },
    { accessorKey: "nombre", header: "Nombre", cell: "text" },
    { accessorKey: "apellido", header: "Apellido", cell: "text" },
    { accessorKey: "cargo", header: "Cargo", cell: "text" },
    { accessorKey: "fecha_contratacion", header: "Fecha de Contratación", cell: "text" },
    { accessorKey: "email", header: "Email", cell: "text" },
]

export function PersonalMenu() {
    const [dataPersonal, setDataPersonal] = useState([])
    const [modalState, setModalState] = useState({ isOpen: false, data: null, action: null })
    const [isLoading, setIsLoading] = useState(true)
    const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, personalToDelete: null })

    useEffect(() => {
        fetchPersonal()
    }, [])

    const fetchPersonal = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.from('personal').select('*')
        if (error) {
            console.log('error', error)
        } else {
            setDataPersonal(data)
        }
        setIsLoading(false)
    }

    const handleAdd = () => {
        setModalState({ isOpen: true, data: null, action: "add" })
    }

    const handleEdit = (editedItem) => {
        setModalState({ isOpen: true, data: editedItem, action: "edit" })
    }

    const handleDeleteConfirmation = (personal) => {
        setDeleteDialogState({ isOpen: true, personalToDelete: personal })
    }

    const handleDelete = async () => {
        if (deleteDialogState.personalToDelete && deleteDialogState.personalToDelete.id) {
            setIsLoading(true)
            const { error } = await supabase.from('personal').delete().eq('id', deleteDialogState.personalToDelete.id)
            if (error) {
                console.log('Error deleting personal:', error)
            } else {
                setDataPersonal(dataPersonal.filter(item => item.id !== deleteDialogState.personalToDelete.id))
            }
            setIsLoading(false)
            setDeleteDialogState({ isOpen: false, personalToDelete: null })
        }
    }

    const handleSave = async (data) => {
        setIsLoading(true)
        const { nombre, apellido, cargo, fecha_contratacion, email, password } = data
        const personalData = { nombre, apellido, cargo, fecha_contratacion, email, password }

        if (modalState.action === "add") {
            const { data: newPersonal, error } = await supabase
                .from('personal')
                .insert(personalData)
                .select()
            if (error) {
                console.log('Error adding personal:', error)
            } else {
                setDataPersonal([...dataPersonal, newPersonal[0]])
            }
        } else {
            const { error } = await supabase
                .from('personal')
                .update(personalData)
                .eq('id', modalState.data.id)
            if (error) {
                console.log('Error updating personal:', error)
            } else {
                setDataPersonal(dataPersonal.map(item => item.id === modalState.data.id ? {...item, ...personalData} : item))
            }
        }
        setIsLoading(false)
        setModalState({ isOpen: false, data: null, action: null })
    }

    const handleCloseModal = () => {
        setModalState({ isOpen: false, data: null, action: null })
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Personal</CardTitle>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar personal
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : dataPersonal.length > 0 ? (
                    <DataTable
                        data={dataPersonal}
                        columns={columnsPersonal}
                        headers={Object.keys(dataPersonal[0]).filter(key => key !== 'id' && key !== 'password')}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDeleteConfirmation}
                    />
                ) : (
                    <div className="text-center text-muted-foreground">No hay personal registrado</div>
                )}
            </CardContent>
            <PersonalModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                initialData={modalState.data}
                accion={modalState.action}
                onSave={handleSave}
            />
            <AlertDialog open={deleteDialogState.isOpen} onOpenChange={(isOpen) => setDeleteDialogState(prev => ({ ...prev, isOpen }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente a 
                            &quot;{deleteDialogState.personalToDelete?.nombre} {deleteDialogState.personalToDelete?.apellido}&quot; de la base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogState({ isOpen: false, personalToDelete: null })}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

