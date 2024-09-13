import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Users, BookOpen, UserCheck, Plus, Edit, Trash, LogOut, Menu, ChevronDown } from "lucide-react"
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

const initialData = {
    personal: [
        { id: 1, nombre: "Ana García", cargo: "Bibliotecaria", antiguedad: "5 años" },
        { id: 2, nombre: "Carlos Pérez", cargo: "Asistente", antiguedad: "2 años" },
        { id: 3, nombre: "María López", cargo: "Encargada de TI", antiguedad: "3 años" },
    ],
    libros: [
        { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", genero: "Realismo mágico", anioPublicacion: 1967, isbn: "978-0307474728", copias: 3 },
        { id: 2, titulo: "1984", autor: "George Orwell", genero: "Ciencia ficción", anioPublicacion: 1949, isbn: "978-0451524935", copias: 2 },
        { id: 3, titulo: "El principito", autor: "Antoine de Saint-Exupéry", genero: "Literatura infantil", anioPublicacion: 1943, isbn: "978-0156012195", copias: 4 },
        { id: 4, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", genero: "Novela", anioPublicacion: 1605, isbn: "978-8424922580", copias: 2 },
        { id: 5, titulo: "Orgullo y prejuicio", autor: "Jane Austen", genero: "Novela romántica", anioPublicacion: 1813, isbn: "978-0141439518", copias: 3 },
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

    const [activeSection, setActiveSection] = useState("libros")
    const [data, setData] = useState(initialData)
    const [editItem, setEditItem] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })

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
        setSearchTerm("")
        setCurrentPage(1)
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
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

    const filteredData = data[activeSection].filter((item) => {
        if (activeSection === "libros") {
            return Object.values(item).some(
                (value) =>
                    value &&
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return true;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortConfig.key) {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];
            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        }
        return 0;
    });

    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const renderTable = () => {
        const tableData = paginatedData
        const headers = Object.keys(data[activeSection][0]).filter(key => key !== "id")

        return (
            <div>
                <div className="flex justify-between items-center mb-4">
                    <Input
                        placeholder="Buscar..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Mostrar {itemsPerPage} <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                                <DropdownMenuCheckboxItem
                                    key={pageSize}
                                    className="capitalize"
                                    checked={itemsPerPage === pageSize}
                                    onCheckedChange={() => setItemsPerPage(pageSize)}
                                >
                                    {pageSize}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {headers.map((header) => (
                                <TableHead
                                    key={header}
                                    className="capitalize cursor-pointer"
                                    onClick={() => handleSort(header)}
                                >
                                    {header}
                                    {sortConfig.key === header && (
                                        <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                                    )}
                                </TableHead>
                            ))}
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((item) => (
                            <TableRow key={item.id}>
                                {headers.map((header) => (
                                    <TableCell key={header}>{item[header]}</TableCell>
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
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <div>
                        Página {currentPage} de {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((old) => Math.min(old + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
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
                        <Link to={"/"}>
                            <Button variant="outline" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar sesión
                            </Button>
                        </Link>
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