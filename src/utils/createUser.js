import { supabase } from '~/utils/supabase';

async function createUser({
    nombre,
    apellido,
    cargo,
    fecha_contratacion,
    email,
    password,
}) {
    // Crear el usuario en Supabase Auth
    const { user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        console.error('Error creating user:', error.message);
        return;
    }

    // Si el usuario se creó exitosamente, agregarlo a la tabla `personal`
    const { data, error: insertError } = await supabase
        .from('personal')
        .insert([
            {
                nombre,
                apellido,
                cargo,
                fecha_contratacion,
                email,
                password, // Aunque el password está en Supabase Auth, podrías almacenarlo también aquí (preferible que esté encriptado).
            },
        ]).select();

    if (insertError) {
        console.error('Error adding user to personal:', insertError.message);
    } else {
        console.log('User added to personal:', data);
    }
}

export { createUser };