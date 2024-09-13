import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Book, Users, BookOpen, UserCheck, Plus, Edit, Trash, LogOut, Menu } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const initialData = {
    personal: [
        { id: 1, nombre: "Ana García", cargo: "Bibliotecaria", antiguedad: "5 años" },
        { id: 2, nombre: "Carlos Pérez", cargo: "Asistente", antiguedad: "2 años" },
        { id: 3, nombre: "María López", cargo: "Encargada de TI", antiguedad: "3 años" },
    ],
    libros: [
        { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", copias: 3 },
        { id: 2, titulo: "1984", autor: "George Orwell", copias: 2 },
        { id: 3, titulo: "El principito", autor: "Antoine de Saint-Exupéry", copias: 4 },
    ],
    prestamos: [
        { id: 1, libro: "Cien años de soledad", cliente: "Juan Rodríguez", fechaPrestamo: "2023-05-01", fechaDevolucion: "2023-05-15" },
        { id: 2, libro: "1984", cliente: "Laura Sánchez", fechaPrestamo: "2023-05-03", fechaDevolucion: "2023-05-17" },
        { id: 3, libro: "El principito", cliente: "Pedro Gómez", fechaPrestamo: "2023-05-05", fechaDevolucion: "2023-05-19" },
    ],
    clientes: [
        { id: 1, nombre: "Juan Rodríguez", email: "juan@example.com", librosPrestados: 1 },
        { id: 2, nombre: "Laura Sánchez", email: "laura@example.com", librosPrestados: 1 },
        { id: 3, nombre: "Pedro Gómez", email: "pedro@example.com", librosPrestados: 1 },
    ],
}

function Dashboard() {

    const [activeSection, setActiveSection] = useState("personal")
    const [data, setData] = useState(initialData)
    const [editItem, setEditItem] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleAdd = (newItem) => {
        setData((prevData) => ({
            ...prevData,
            [activeSection]: [...prevData[activeSection], { id: Date.now(), ...newItem }],
        }))
    }

    const handleEdit = (editedItem) => {
        setData((prevData) => ({
            ...prevData,
            [activeSection]: prevData[activeSection].map((item) =>
                item.id === editedItem.id ? editedItem : item
            ),
        }))
    }

    const handleDelete = (id) => {
        setData((prevData) => ({
            ...prevData,
            [activeSection]: prevData[activeSection].filter((item) => item.id !== id),
        }))
    }

    const handleLogout = () => {
        console.log("Cerrando sesión...")
    }

    const handleSectionChange = (section) => {
        setActiveSection(section)
        setIsMenuOpen(false)
    }

    const renderForm = (item = null, onSubmit) => {
        const fields = Object.keys(data[activeSection][0]).filter((key) => key !== "id")
        return (
            <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                const newItem = Object.fromEntries(formData.entries())
                onSubmit(item ? { ...item, ...newItem } : newItem)
            }} className="space-y-4">
                {fields.map((field) => (
                    <div key={field}>
                        <Label htmlFor={field} className="capitalize">{field}</Label>
                        <Input
                            id={field}
                            name={field}
                            defaultValue={item ? item[field] : ""}
                            required
                        />
                    </div>
                ))}
                <Button type="submit">{item ? "Guardar cambios" : "Agregar"}</Button>
            </form>
        )
    }

    const renderTable = () => {
        const tableData = data[activeSection]
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        {Object.keys(tableData[0]).filter(key => key !== "id").map((key) => (
                            <TableHead key={key} className="capitalize">
                                {key}
                            </TableHead>
                        ))}
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.map((item) => (
                        <TableRow key={item.id}>
                            {Object.entries(item).filter(([key]) => key !== "id").map(([key, value]) => (
                                <TableCell key={key}>{value}</TableCell>
                            ))}
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="icon" onClick={() => setEditItem(item)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Editar {activeSection.slice(0, -1)}</DialogTitle>
                                            </DialogHeader>
                                            {renderForm(item, (editedItem) => {
                                                handleEdit(editedItem)
                                                setEditItem(null)
                                            })}
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )
    }

    const renderNavigation = () => (
        <>
            <Button
                variant={activeSection === "personal" ? "default" : "ghost"}
                onClick={() => handleSectionChange("personal")}
            >
                Personal
            </Button>
            <Button
                variant={activeSection === "libros" ? "default" : "ghost"}
                onClick={() => handleSectionChange("libros")}
            >
                Libros
            </Button>
            <Button
                variant={activeSection === "prestamos" ? "default" : "ghost"}
                onClick={() => handleSectionChange("prestamos")}
            >
                Préstamos
            </Button>
            <Button
                variant={activeSection === "clientes" ? "default" : "ghost"}
                onClick={() => handleSectionChange("clientes")}
            >
                Clientes
            </Button>
        </>
    )

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="mr-2 lg:hidden">
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left">
                                    <SheetHeader>
                                        <SheetTitle>Menú</SheetTitle>
                                    </SheetHeader>
                                    <nav className="flex flex-col space-y-4 mt-4">
                                        {renderNavigation()}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                            <nav className="hidden lg:flex lg:space-x-4">
                                {renderNavigation()}
                            </nav>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Cerrar sesión
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-grow py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Personal</CardTitle>
                                <Users className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.personal.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Libros</CardTitle>
                                <Book className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.libros.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Préstamos</CardTitle>
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.prestamos.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                                <UserCheck className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{data.clientes.length}</div>
                            </CardContent>
                        </Card>
                    </div>
                    <Card className="mt-6">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="capitalize">{activeSection}</CardTitle>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" /> Agregar {activeSection.slice(0, -1)}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Agregar {activeSection.slice(0, -1)}</DialogTitle>
                                    </DialogHeader>
                                    {renderForm(null, handleAdd)}
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>{renderTable()}</CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;