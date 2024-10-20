import { useState } from 'react';
import { supabase } from '~/utils/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { IconArrowNarrowLeft } from '@tabler/icons-react';

// tempotal
import { createUser } from '~/utils/createUser';

function Login() {

    const [showPassword, setShowPassword] = useState(false)
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Intentando iniciar sesión con:', email);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            console.log('Respuesta de Supabase:', data);
            navigate('/dashboard');
        } catch (error) {
            console.error('Error detallado:', error);
            alert('Error de autenticación: ' + error.message);
        }
    };

    // Función temporal para crear un usuario
    // eslint-disable-next-line no-unused-vars
    // const handleCreateUser = async () => {
    //     // createUser({
    //     //     nombre: 'José Ramón',
    //     //     apellido: 'Tejeda Navarro',
    //     //     cargo: 'Administrador',
    //     //     fecha_contratacion: '2024-09-12',
    //     //     email: 'yosefhknt@gmail.com',
    //     //     password: 'Kukyguapa100',
    //     // });
    //     // createUser({
    //     //     nombre: 'Antonio',
    //     //     apellido: 'Gomez',
    //     //     cargo: 'Administrador',
    //     //     fecha_contratacion: '2024-10-20',
    //     //     email: 'luangomezlo@ittepic.edu.mx',
    //     //     password: '123456',
    //     // });
    //     // createUser({
    //     //     nombre: 'Miguel Angel',
    //     //     apellido: 'Ahumada Delgado',
    //     //     cargo: 'Administrador',
    //     //     fecha_contratacion: '2024-10-20',
    //     //     email: 'mianahumadade@ittepic.edu.mx',
    //     //     password: '654321',
    //     // });
    //     // createUser({
    //     //     nombre: 'Jaime',
    //     //     apellido: 'Torres Reyes',
    //     //     cargo: 'Administrador',
    //     //     fecha_contratacion: '2024-10-20',
    //     //     email: 'jacatorresre@ittepic.edu.mx',
    //     //     password: 'mikefortnite23',
    //     // });

    //     let { data: clientes, error } = await supabase
    //         .from('clientes')
    //         .select('*')

    //     console.log(clientes);
    // };



    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
                    <CardDescription className="text-center">
                        Ingresa tus credenciales para acceder
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="tu@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button type='submit' className="w-full">
                            Iniciar Sesión
                        </Button>
                        <Link to={"/"} className=" flex w-full items-center justify-center hover:underline">
                            <IconArrowNarrowLeft stroke={2} />
                            Volver al inicio
                        </Link>
                    </CardFooter>
                </form>
            </Card>
            {/* Botón temporal para crear un usuario */}
            <div className='flex flex-col'>
                {/* <button type="button" onClick={handleCreateUser}>
                    Crear Usuario Admin
                </button> */}
                <Link to={"/dashboard"}>
                    <button type="button" >
                        Ir a Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default Login;