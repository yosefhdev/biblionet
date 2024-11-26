import { useState, useEffect } from "react"
import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import ClientesModal from "~/components/ClientesModal"
import { supabase } from "~/utils/supabase"

const columnsClientes = [
    { accessorKey: "id", header: "ID", cell: "id" },
    { accessorKey: "nombre", header: "Nombre", cell: "text" },
    { accessorKey: "apellido_paterno", header: "Apellido paterno", cell: "text" },
    { accessorKey: "apellido_materno", header: "Apellido materno", cell: "text" },
    { accessorKey: "direccion", header: "Dirección", cell: "text" },
    { accessorKey: "telefono", header: "Teléfono", cell: "text" },
    { accessorKey: "email", header: "Correo electrónico", cell: "text" },
    { accessorKey: "prestamos", header: "Libros prestados", cell: "text" },
]

export function ClientesMenu() {
    const [dataClientes, setDataClientes] = useState([])
    const [showClientesModal, setShowClientesModal] = useState(false)
    const [selectedCliente, setSelectedCliente] = useState(null)
    const [accion, setAccion] = useState("add")

    useEffect(() => {
        fetchClientes().then(data => setDataClientes(data))
    }, [])

    const handleAdd = () => {
        setAccion("add")
        setSelectedCliente(null)
        setShowClientesModal(true)
    }

    const handleEdit = (editedItem) => {
        setAccion("edit")
        setSelectedCliente(editedItem)
        setShowClientesModal(true)
    }

    const handleDelete = (id) => {
        setDataClientes(dataClientes.filter(item => item.id !== id))
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
                {dataClientes.length > 0 ? (
                    <DataTable
                        data={dataClientes}
                        columns={columnsClientes}
                        headers={Object.keys(dataClientes[0]).filter(key => key !== 'id')}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ) : (
                    <div className="text-center text-muted-foreground">No hay clientes registrados</div>
                )}
            </CardContent>
            <ClientesModal
                isOpen={showClientesModal}
                onClose={() => setShowClientesModal(false)}
                initialData={selectedCliente}
                accion={accion}
            />
        </Card>
    )
}

async function fetchClientes() {
    const { data, error } = await supabase
        .from('clientes')
        .select(`
            id,
            nombre,
            apellido_paterno,
            apellido_materno,
            direccion,
            telefono,
            email,
            prestamos (id)
          `)
    if (error) {
        console.log('error', error)
        return []
    } else {
        return data.map(cliente => ({
            ...cliente,
            prestamos: cliente.prestamos ? cliente.prestamos.length : 0,
        }))
    }
}

