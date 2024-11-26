import { useState, useEffect } from "react"
import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from 'lucide-react'
import PersonalModal from "~/components/PersonalModal"
import { supabase } from "~/utils/supabase"

const columnsPersonal = [
    { accessorKey: "id", header: "ID", cell: "id" },
    { accessorKey: "nombre", header: "Nombre", cell: "text" },
    { accessorKey: "cargo", header: "Cargo", cell: "text" },
]

export function PersonalMenu() {
    const [dataPersonal, setDataPersonal] = useState([])
    const [showPersonalModal, setShowPersonalModal] = useState(false)
    const [selectedPersonal, setSelectedPersonal] = useState(null)
    const [accion, setAccion] = useState("add")

    useEffect(() => {
        fetchPersonal().then(data => setDataPersonal(data))
    }, [])

    const handleAdd = () => {
        setAccion("add")
        setSelectedPersonal(null)
        setShowPersonalModal(true)
    }

    const handleEdit = (editedItem) => {
        setAccion("edit")
        setSelectedPersonal(editedItem)
        setShowPersonalModal(true)
    }

    const handleDelete = (id) => {
        setDataPersonal(dataPersonal.filter(item => item.id !== id))
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
                {dataPersonal.length > 0 ? (
                    <DataTable
                        data={dataPersonal}
                        columns={columnsPersonal}
                        headers={Object.keys(dataPersonal[0]).filter(key => key !== 'id')}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ) : (
                    <div className="text-center text-muted-foreground">No hay personal registrado</div>
                )}
            </CardContent>
            <PersonalModal
                isOpen={showPersonalModal}
                onClose={() => setShowPersonalModal(false)}
                initialData={selectedPersonal}
                accion={accion}
            />
        </Card>
    )
}

async function fetchPersonal() {
    const { data, error } = await supabase.from('personal').select('*')
    if (error) {
        console.log('error', error)
        return []
    } else {
        return data
    }
}

