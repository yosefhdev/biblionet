import { useState, useEffect } from "react"
import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2 } from 'lucide-react'
import ClientesModal from "~/components/ClientesModal"
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

const columnsClientes = [
    // { accessorKey: "id", header: "ID", cell: "id" },
    { accessorKey: "nombre", header: "Nombre", cell: "text" },
    { accessorKey: "apellido_paterno", header: "Apellido Paterno", cell: "text" },
    { accessorKey: "apellido_materno", header: "Apellido Materno", cell: "text" },
    { accessorKey: "direccion", header: "Dirección", cell: "text" },
    { accessorKey: "telefono", header: "Teléfono", cell: "text" },
    { accessorKey: "email", header: "Email", cell: "text" },
]

export function ClientesMenu() {
    const [dataClientes, setDataClientes] = useState([])
    const [modalState, setModalState] = useState({ isOpen: false, data: null, action: null })
    const [isLoading, setIsLoading] = useState(true)
    const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, clienteToDelete: null })

    useEffect(() => {
        fetchClientes()
    }, [])

    const fetchClientes = async () => {
        setIsLoading(true)
        const { data, error } = await supabase.from('clientes').select('*')
        if (error) {
            console.log('error', error)
        } else {
            setDataClientes(data)
        }
        setIsLoading(false)
    }

    const handleAdd = () => {
        setModalState({ isOpen: true, data: null, action: "add" })
    }

    const handleEdit = (editedItem) => {
        setModalState({ isOpen: true, data: editedItem, action: "edit" })
    }

    const handleDeleteConfirmation = (cliente) => {
        setDeleteDialogState({ isOpen: true, clienteToDelete: cliente })
    }

    const handleDelete = async () => {
        if (deleteDialogState.clienteToDelete && deleteDialogState.clienteToDelete.id) {
            setIsLoading(true)
            const { error } = await supabase.from('clientes').delete().eq('id', deleteDialogState.clienteToDelete.id)
            if (error) {
                console.log('Error deleting cliente:', error)
            } else {
                setDataClientes(dataClientes.filter(item => item.id !== deleteDialogState.clienteToDelete.id))
            }
            setIsLoading(false)
            setDeleteDialogState({ isOpen: false, clienteToDelete: null })
        }
    }

    const handleSave = async (data) => {
        setIsLoading(true)
        const { nombre, apellido_paterno, apellido_materno, direccion, telefono, email } = data
        const clienteData = { nombre, apellido_paterno, apellido_materno, direccion, telefono, email }

        if (modalState.action === "add") {
            const { data: newCliente, error } = await supabase
                .from('clientes')
                .insert(clienteData)
                .select()
            if (error) {
                console.log('Error adding cliente:', error)
            } else {
                setDataClientes([...dataClientes, newCliente[0]])
            }
        } else {
            const { error } = await supabase
                .from('clientes')
                .update(clienteData)
                .eq('id', modalState.data.id)
            if (error) {
                console.log('Error updating cliente:', error)
            } else {
                setDataClientes(dataClientes.map(item => item.id === modalState.data.id ? { ...item, ...clienteData } : item))
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
                <CardTitle>Clientes</CardTitle>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar cliente
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : dataClientes.length > 0 ? (
                    <DataTable
                        data={dataClientes}
                        columns={columnsClientes}
                        headers={Object.keys(dataClientes[0]).filter(key => key !== 'id')}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDeleteConfirmation}
                    />
                ) : (
                    <div className="text-center text-muted-foreground">No hay clientes registrados</div>
                )}
            </CardContent>
            <ClientesModal
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
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al cliente
                            &quot;{deleteDialogState.clienteToDelete?.nombre} {deleteDialogState.clienteToDelete?.apellido_paterno}&quot; de la base de datos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogState({ isOpen: false, clienteToDelete: null })}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

