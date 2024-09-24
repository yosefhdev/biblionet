/* eslint-disable no-unused-vars */
import DataTable from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Book, BookOpen, LogOut, Menu, Plus, UserCheck, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { set } from "react-hook-form"
import { Link } from "react-router-dom"
import LibrosModal from "~/components/LibrosModal"
import PersonalModal from "~/components/PersonalModal"
import ClientesModal from "~/components/ClientesModal"
import PrestamosModal from "~/components/PrestamosModal"

const personal = [
    { id: 1, nombre: "Ana García", cargo: "Bibliotecaria", antiguedad: "5 años" },
    { id: 2, nombre: "Carlos Pérez", cargo: "Asistente", antiguedad: "2 años" },
    { id: 3, nombre: "María López", cargo: "Encargada de TI", antiguedad: "3 años" },
]
const libros = [
    { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", genero: "Realismo mágico", anioPublicacion: 1967, isbn: "978-0307474728", copias: 3 },
    { id: 2, titulo: "1984", autor: "George Orwell", genero: "Ciencia ficción", anioPublicacion: 1949, isbn: "978-0451524935", copias: 2 },
    { id: 3, titulo: "El principito", autor: "Antoine de Saint-Exupéry", genero: "Literatura infantil", anioPublicacion: 1943, isbn: "978-0156012195", copias: 4 },
    { id: 4, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", genero: "Novela", anioPublicacion: 1605, isbn: "978-8424922580", copias: 2 },
    { id: 5, titulo: "Orgullo y prejuicio", autor: "Jane Austen", genero: "Novela romántica", anioPublicacion: 1813, isbn: "978-0141439518", copias: 3 },
]
const prestamos = [
    { id: 1, libro: "Cien años de soledad", cliente: "Juan Rodríguez", fechaPrestamo: "2023-05-01", fechaDevolucion: "2023-05-15" },
    { id: 2, libro: "1984", cliente: "Laura Sánchez", fechaPrestamo: "2023-05-03", fechaDevolucion: "2023-05-17" },
    { id: 3, libro: "El principito", cliente: "Pedro Gómez", fechaPrestamo: "2023-05-05", fechaDevolucion: "2023-05-19" },
]
const clientes = [
    { id: 1, nombre: "Juan Rodríguez", email: "juan@example.com", librosPrestados: 1 },
    { id: 2, nombre: "Laura Sánchez", email: "laura@example.com", librosPrestados: 1 },
    { id: 3, nombre: "Pedro Gómez", email: "pedro@example.com", librosPrestados: 1 },
]

// Columnas de la tabla
const columnsPersonal = [
    {
        accessorKey: "id",
        header: "ID",
        cell: "id",
    },
    {
        accessorKey: "nombre",
        header: "Nombre",
        cell: "text",
    },
    {
        accessorKey: "cargo",
        header: "Cargo",
        cell: "text",
    },
    {
        accessorKey: "antiguedad",
        header: "Antigüedad",
        cell: "text",
    },
]

const columnsLibros = [
    {
        accessorKey: "id",
        header: "ID",
        cell: "id",
    },
    {
        accessorKey: "titulo",
        header: "Título",
        cell: "text",
    },
    {
        accessorKey: "autor",
        header: "Autor",
        cell: "text",
    },
    {
        accessorKey: "genero",
        header: "Género",
        cell: "text",
    },
    {
        accessorKey: "anioPublicacion",
        header: "Año de publicación",
        cell: "text",
    },
    {
        accessorKey: "isbn",
        header: "ISBN",
        cell: "text",
    },
    {
        accessorKey: "copias",
        header: "Copias",
        cell: "text",
    },
]

const columnsPrestamos = [
    {
        accessorKey: "id",
        header: "ID",
        cell: "id",
    },
    {
        accessorKey: "libro",
        header: "Libro",
        cell: "text",
    },
    {
        accessorKey: "cliente",
        header: "Cliente",
        cell: "text",
    },
    {
        accessorKey: "fechaPrestamo",
        header: "Fecha de préstamo",
        cell: "text",
    },
    {
        accessorKey: "fechaDevolucion",
        header: "Fecha de devolución",
        cell: "text",
    },
]

const columnsClientes = [
    {
        accessorKey: "id",
        header: "ID",
        cell: "id",
    },
    {
        accessorKey: "nombre",
        header: "Nombre",
        cell: "text",
    },
    {
        accessorKey: "email",
        header: "Correo electrónico",
        cell: "text",
    },
    {
        accessorKey: "librosPrestados",
        header: "Libros prestados",
        cell: "text",
    },
]


function Dashboard() {
    const [activeSection, setActiveSection] = useState("libros");
    const [dataPersonal, setDataPersonal] = useState(personal);
    const [dataLibros, setDataLibros] = useState(libros);
    const [dataPrestamos, setDataPrestamos] = useState(prestamos);
    const [dataClientes, setDataClientes] = useState(clientes);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // States para el elemento seleccionado
    let [selectedPersonal, setSelectedPersonal] = useState(null);
    let [selectedLibro, setSelectedLibro] = useState(null);
    let [selectedPrestamo, setSelectedPrestamo] = useState(null);
    let [selectedCliente, setSelectedCliente] = useState(null);
    // States para modales
    const [showPersonalModal, setShowPersonalModal] = useState(false);
    const [showLibrosModal, setShowLibrosModal] = useState(false);
    const [showPrestamosModal, setShowPrestamosModal] = useState(false);
    const [showClientesModal, setShowClientesModal] = useState(false);
    // accion
    const [accion, setAccion] = useState("add");

    const handleLogout = () => {
        console.log("Cerrando sesión...");
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(prev => !prev);
    };

    // Funciones para manejar datos
    const handleAdd = (section, newItem) => {
        setAccion("add");
        switch (section) {
            case "personal":
                setSelectedPersonal(null);
                setShowPersonalModal(true);
                break;
            case "libros":
                setSelectedLibro(null);
                setShowLibrosModal(true);
                break;
            case "prestamos":
                setSelectedPrestamo(null);
                setShowPrestamosModal(true);
                break;
            case "clientes":
                setSelectedCliente(null);
                setShowClientesModal(true);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        if (selectedPersonal) {
            setShowPersonalModal(true);
        }
    }, [selectedPersonal]);

    useEffect(() => {
        if (selectedLibro) {
            setShowLibrosModal(true);
        }
    }, [selectedLibro]);

    useEffect(() => {
        if (selectedPrestamo) {
            setShowPrestamosModal(true);
        }
    }, [selectedPrestamo]);

    useEffect(() => {
        if (selectedCliente) {
            setShowClientesModal(true);
        }
    }, [selectedCliente]);

    const handleEdit = (section, editedItem) => {
        setAccion("edit");
        switch (section) {
            case "personal":
                setSelectedPersonal(editedItem);  // Solo asigna el item seleccionado
                break;
            case "libros":
                setSelectedLibro(editedItem);     // Solo asigna el item seleccionado
                break;
            case "prestamos":
                setSelectedPrestamo(editedItem);  // Asigna el préstamo seleccionado
                break;
            case "clientes":
                setSelectedCliente(editedItem);   // Asigna el cliente seleccionado
                break;
            default:
                break;
        }
    };

    const handleDelete = (section, id) => {
        switch (section) {
            case "personal":
                setDataPersonal(dataPersonal.filter(item => item.id !== id));
                break;
            case "libros":
                setDataLibros(dataLibros.filter(item => item.id !== id));
                break;
            case "prestamos":
                setDataPrestamos(dataPrestamos.filter(item => item.id !== id));
                break;
            case "clientes":
                setDataClientes(dataClientes.filter(item => item.id !== id));
                break;
            default:
                break;
        }
    };

    const renderDataTable = () => {
        switch (activeSection) {
            case "personal":
                return (
                    <>
                        {dataPersonal.length > 0 ? (
                            <DataTable
                                data={dataPersonal}
                                columns={columnsPersonal}
                                headers={Object.keys(dataPersonal[0]).filter(key => key !== 'id')}
                                onAdd={newItem => handleAdd(activeSection, newItem)}
                                onEdit={editedItem => handleEdit(activeSection, editedItem)}
                                onDelete={id => handleDelete(activeSection, id)}

                            />
                        ) : (
                            <div className="text-center text-muted-foreground">No hay personal registrado</div>
                        )}
                    </>
                );
            case "libros":
                return (
                    <>
                        {dataLibros.length > 0 ? (
                            <DataTable
                                data={dataLibros}
                                columns={columnsLibros}
                                headers={Object.keys(dataLibros[0]).filter(key => key !== 'id')}
                                onAdd={newItem => handleAdd(activeSection, newItem)}
                                onEdit={editedItem => handleEdit(activeSection, editedItem)}
                                onDelete={id => handleDelete(activeSection, id)}
                            />
                        ) : (
                            <div className="text-center text-muted-foreground">No hay libros registrados</div>
                        )}
                    </>
                );
            case "prestamos":
                return (
                    <>
                        {dataPrestamos.length > 0 ? (
                            <DataTable
                                data={dataPrestamos}
                                columns={columnsPrestamos}
                                headers={Object.keys(dataPrestamos[0]).filter(key => key !== 'id')}
                                onAdd={newItem => handleAdd(activeSection, newItem)}
                                onEdit={editedItem => handleEdit(activeSection, editedItem)}
                                onDelete={id => handleDelete(activeSection, id)}
                            />
                        ) : (
                            <div className="text-center text-muted-foreground">No hay préstamos registrados</div>
                        )}
                    </>
                );
            case "clientes":
                return (
                    <>
                        {dataClientes.length > 0 ? (
                            <DataTable
                                data={dataClientes}
                                columns={columnsClientes}
                                headers={Object.keys(dataClientes[0]).filter(key => key !== 'id')}
                                onAdd={newItem => handleAdd(activeSection, newItem)}
                                onEdit={editedItem => handleEdit(activeSection, editedItem)}
                                onDelete={id => handleDelete(activeSection, id)}
                            />

                        ) : (
                            <div className="text-center text-muted-foreground">No hay préstamos registrados</div>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

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
    );

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            {/* Menú lateral para dispositivos móviles */}
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="lg:hidden"
                                        onClick={handleMenuToggle}
                                    >
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

                            {/* Menú de navegación para pantallas grandes */}
                            <nav className="hidden lg:flex lg:space-x-4">
                                {renderNavigation()}
                            </nav>
                        </div>

                        {/* Botón de cerrar sesión */}
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
                    {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                    </div> */}
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-center">
                            <CardTitle className="capitalize">{activeSection}</CardTitle>
                            <Button onClick={() => handleAdd(activeSection)}>
                                <Plus className="mr-2 h-4 w-4" /> Agregar {activeSection.slice(0, -1)}
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {renderDataTable()}
                        </CardContent>
                    </Card>
                </div>
                {/* Modales */}
                <PersonalModal
                    isOpen={showPersonalModal}
                    onClose={() => setShowPersonalModal(false)}
                    initialData={selectedPersonal}
                    accion={accion}
                />
                <LibrosModal
                    isOpen={showLibrosModal}
                    onClose={() => setShowLibrosModal(false)}
                    initialData={selectedLibro}
                    accion={accion}
                />
                <PrestamosModal
                    isOpen={showPrestamosModal}
                    onClose={() => setShowPrestamosModal(false)}
                    initialData={selectedPrestamo}
                    accion={accion}
                />
                <ClientesModal
                    isOpen={showClientesModal}
                    onClose={() => setShowClientesModal(false)}
                    initialData={selectedCliente}
                    accion={accion}
                />
            </main>
        </div>
    );
}

export default Dashboard;