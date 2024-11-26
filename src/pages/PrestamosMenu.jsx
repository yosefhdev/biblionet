import { useState, useEffect } from "react"
import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from 'lucide-react'
import PrestamosModal from "~/components/PrestamosModal"
import { supabase } from "~/utils/supabase"

const columnsPrestamos = [
    { accessorKey: "id", header: "ID", cell: "id" },
    { accessorKey: "libro", header: "Libro", cell: "text" },
    { accessorKey: "cliente", header: "Cliente", cell: "text" },
    { accessorKey: "fechaPrestamo", header: "Fecha de préstamo", cell: "text" },
    { accessorKey: "fechaDevolucion", header: "Fecha de devolución", cell: "text" },
]

export function PrestamosMenu() {
    const [dataPrestamos, setDataPrestamos] = useState([])
    const [showPrestamosModal, setShowPrestamosModal] = useState(false)
    const [selectedPrestamo, setSelectedPrestamo] = useState(null)
    const [accion, setAccion] = useState("add")

    useEffect(() => {
        fetchPrestamos().then(data => setDataPrestamos(data))
    }, [])

    const handleAdd = () => {
        setAccion("add")
        setSelectedPrestamo(null)
        setShowPrestamosModal(true)
    }

    const handleEdit = (editedItem) => {
        setAccion("edit")
        setSelectedPrestamo(editedItem)
        setShowPrestamosModal(true)
    }

    const handleDelete = (id) => {
        setDataPrestamos(dataPrestamos.filter(item => item.id !== id))
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Préstamos</CardTitle>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar préstamo
                </Button>
            </CardHeader>
            <CardContent>
                {dataPrestamos.length > 0 ? (
                    <DataTable
                        data={dataPrestamos}
                        columns={columnsPrestamos}
                        headers={Object.keys(dataPrestamos[0]).filter(key => key !== 'id')}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ) : (
                    <div className="text-center text-muted-foreground">No hay préstamos registrados</div>
                )}
            </CardContent>
            <PrestamosModal
                isOpen={showPrestamosModal}
                onClose={() => setShowPrestamosModal(false)}
                initialData={selectedPrestamo}
                accion={accion}
            />
        </Card>
    )
}

async function fetchPrestamos() {
    const { data, error } = await supabase.from('prestamos').select('*')
    if (error) {
        console.log('error', error)
        return []
    } else {
        return data
    }
}

