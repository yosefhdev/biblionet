import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { LogOut, Menu } from 'lucide-react'
import { Link } from "react-router-dom"
import { LibrosMenu } from "./LibrosMenu"
import { ClientesMenu } from "./ClientesMenu"
import { PersonalMenu } from "./PersonalMenu"
import { PrestamosMenu } from "./PrestamosMenu"

function Dashboard() {
    const [activeSection, setActiveSection] = useState("libros")
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = () => {
        console.log("Cerrando sesión...")
    }

    const handleMenuToggle = () => {
        setIsMenuOpen(prev => !prev)
    }

    const handleSectionChange = (section) => {
        setActiveSection(section)
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

    const renderActiveMenu = () => {
        switch (activeSection) {
            case "personal":
                return <PersonalMenu />
            case "libros":
                return <LibrosMenu />
            case "prestamos":
                return <PrestamosMenu />
            case "clientes":
                return <ClientesMenu />
            default:
                return null
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="sm:hidden"
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

                            <nav className="hidden sm:flex sm:space-x-4">
                                {renderNavigation()}
                            </nav>
                        </div>

                        <Link to="/">
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
                    {renderActiveMenu()}
                </div>
            </main>
        </div>
    )
}

export default Dashboard

