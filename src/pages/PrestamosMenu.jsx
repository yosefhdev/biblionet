import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Plus } from 'lucide-react'
import { useEffect, useState } from "react"
import CambiarEstatusModal from "~/components/CambiarEstatusModal"
import PrestamosModal from "~/components/PrestamosModal"
import { supabase } from "~/utils/supabase"
import { updateLoanStatus } from "~/utils/updateLoanStatus"

export function PrestamosMenu() {
    const [dataPrestamos, setDataPrestamos] = useState([])
    const [modalState, setModalState] = useState({ isOpen: false, data: null, action: null })
    const [isLoading, setIsLoading] = useState(true)
    const [changeStatusModal, setChangeStatusModal] = useState({ isOpen: false, prestamo: null })

    const columnsPrestamos = [
        // { accessorKey: "id", header: "ID", cell: "id" },
        { accessorKey: "cliente_nombre", header: "Cliente", cell: "text" },
        { accessorKey: "personal_nombre", header: "Personal", cell: "text" },
        { accessorKey: "fecha_prestamo", header: "Fecha de Préstamo", cell: "text" },
        { accessorKey: "fecha_devolucion", header: "Fecha de Devolución", cell: "text" },
        { accessorKey: "libros", header: "Libros", cell: "text" },
        { accessorKey: "estatus", header: "Estatus", cell: "text" },
    ]



    useEffect(() => {
        async function updateAndFetch() {
            await updateLoanStatus()
            await fetchPrestamos()
        }
        updateAndFetch()
    }, [])

    const fetchPrestamos = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('prestamos')
            .select(`
                id,
                fecha_prestamo,
                fecha_devolucion,
                estatus,
                clientes (id, nombre, apellido_paterno),
                personal (id, nombre, apellido),
                prestamos_libros (libro_id)
            `)

        if (error) {
            console.log('error', error)
        } else {
            const formattedData = await Promise.all(data.map(async (prestamo) => {
                const { data: librosData, error: librosError } = await supabase
                    .from('libros')
                    .select('titulo')
                    .in('id', prestamo.prestamos_libros.map(pl => pl.libro_id))

                if (librosError) {
                    console.log('error fetching libros', librosError)
                    return null
                }

                return {
                    id: prestamo.id,
                    cliente_nombre: `${prestamo.clientes.nombre} ${prestamo.clientes.apellido_paterno}`,
                    personal_nombre: `${prestamo.personal.nombre} ${prestamo.personal.apellido}`,
                    fecha_prestamo: prestamo.fecha_prestamo,
                    fecha_devolucion: prestamo.fecha_devolucion,
                    libros: librosData.map(libro => libro.titulo).join(', '),
                    estatus: prestamo.estatus
                }
            }))

            setDataPrestamos(formattedData.filter(Boolean))
        }
        setIsLoading(false)
    }

    const handleAdd = () => {
        setModalState({ isOpen: true, data: null, action: "add" })
    }

    const handleSave = async (data) => {
        setIsLoading(true)
        const { cliente_id, personal_id, fecha_prestamo, fecha_devolucion, libros } = data

        // Insertar el préstamo
        const { data: newPrestamo, error: prestamoError } = await supabase
            .from('prestamos')
            .insert({
                cliente_id: cliente_id.id,
                personal_id: personal_id.id,
                fecha_prestamo,
                fecha_devolucion,
                estatus: "Pendiente"
            })
            .select()

        if (prestamoError) {
            console.log('Error adding prestamo:', prestamoError)
            setIsLoading(false)
            return
        }

        const prestamo_id = newPrestamo[0].id

        // Insertar los libros prestados y actualizar el inventario
        for (const libro of libros) {
            // Insertar en prestamos_libros
            const { error: prestamosLibrosError } = await supabase
                .from('prestamos_libros')
                .insert({
                    prestamo_id,
                    libro_id: libro.id
                })

            if (prestamosLibrosError) {
                console.log('Error adding prestamos_libros:', prestamosLibrosError)
                continue
            }

            // Actualizar el inventario de libros
            const { error: updateLibroError } = await supabase
                .from('libros')
                .update({ copias: libro.copias - 1 })
                .eq('id', libro.id)

            if (updateLibroError) {
                console.log('Error updating libro inventory:', updateLibroError)
            }
        }

        await fetchPrestamos()
        setIsLoading(false)
        setModalState({ isOpen: false, data: null, action: null })
    }

    const handleCloseModal = () => {
        setModalState({ isOpen: false, data: null, action: null })
    }

    const handleChangeStatus = (prestamo) => {
        setChangeStatusModal({ isOpen: true, prestamo })
    }

    const handleSaveStatus = async (newStatus) => {
        setIsLoading(true)
        const { error } = await supabase
            .from('prestamos')
            .update({ estatus: newStatus })
            .eq('id', changeStatusModal.prestamo.id)

        if (error) {
            console.log('Error updating prestamo status:', error)
        } else {
            // Si el nuevo estatus es "Completado", devolver los libros al inventario
            if (newStatus === "Completado") {
                const { data: prestamosLibros, error: fetchError } = await supabase
                    .from('prestamos_libros')
                    .select('libro_id')
                    .eq('prestamo_id', changeStatusModal.prestamo.id)

                if (fetchError) {
                    console.log('Error fetching prestamos_libros:', fetchError)
                } else {
                    for (const { libro_id } of prestamosLibros) {
                        const { error: updateError } = await supabase
                            .from('libros')
                            .update({ copias: supabase.raw('copias + 1') })
                            .eq('id', libro_id)

                        if (updateError) {
                            console.log('Error updating libro inventory:', updateError)
                        }
                    }
                }
            }

            await fetchPrestamos()
        }
        setIsLoading(false)
        setChangeStatusModal({ isOpen: false, prestamo: null })
    }

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Préstamos</CardTitle>
                <Button onClick={handleAdd}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Préstamo
                </Button>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : dataPrestamos.length > 0 ? (
                    <DataTable
                        data={dataPrestamos}
                        columns={columnsPrestamos}
                        headers={Object.keys(dataPrestamos[0]).filter(key => key !== 'id')}
                        onAdd={handleAdd}
                        onEdit={handleChangeStatus}
                        tipoDato="prestamo"
                    />
                ) : (
                    <div className="text-center text-muted-foreground">No hay préstamos registrados</div>
                )}
            </CardContent>
            <PrestamosModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
            />
            <CambiarEstatusModal
                isOpen={changeStatusModal.isOpen}
                onClose={() => setChangeStatusModal({ isOpen: false, prestamo: null })}
                onSave={handleSaveStatus}
                currentStatus={changeStatusModal.prestamo?.estatus}
            />
        </Card>
    )
}

