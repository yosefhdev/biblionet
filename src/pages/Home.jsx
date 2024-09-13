import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpenIcon, ClockIcon, CalendarIcon, PhoneIcon, BookIcon, UserIcon } from "lucide-react"

function Home() {

    return (
        <div className="min-h-screen bg-gray-100">
      <nav className="bg-primary text-primary-foreground py-4 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookIcon className="h-6 w-6" />
            <span className="text-lg font-semibold">BiblioNet</span>
          </div>
          <Link to={"/login"}>
              <Button variant="secondary" size="sm" className="flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Login
              </Button>
          </Link>
        </div>
      </nav>

      <header className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold">Bienvenido a tu Biblioteca</h1>
          <p className="mt-2 text-lg">Descubre, aprende y explora con nosotros</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Busca en Nuestro Catálogo</h2>
          <div className="max-w-md mx-auto">
            <div className="flex w-full items-center space-x-2">
              <Input type="text" placeholder="Buscar libros..." />
              <Button type="submit">Buscar</Button>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClockIcon className="mr-2" />
                Horarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Lunes a Viernes: 9:00 AM - 8:00 PM</p>
              <p>Sábados: 10:00 AM - 6:00 PM</p>
              <p>Domingos: Cerrado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpenIcon className="mr-2" />
                Servicios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside">
                <li>Préstamo de libros</li>
                <li>Acceso a computadoras</li>
                <li>Salas de estudio</li>
                <li>Wi-Fi gratuito</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="mr-2" />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>Club de lectura - 15 de Mayo</li>
                <li>Taller de escritura - 22 de Mayo</li>
                <li>Hora del cuento - Todos los sábados</li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="bg-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="flex items-center justify-center">
            <PhoneIcon className="mr-2" />
            Contáctanos: (123) 456-7890
          </p>
          <p className="mt-2">© 2023 Biblioteca Pública Central. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
    );
}

export default Home;