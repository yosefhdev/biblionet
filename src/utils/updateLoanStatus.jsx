import { supabase } from './supabase'

export async function updateLoanStatus() {
    const today = new Date().toISOString().split('T')[0]

    // Actualizar préstamos vencidos a "Atrasado"
    const { data: updatedLoans, error: updateError } = await supabase
        .from('prestamos')
        .update({ estatus: 'Atrasado' })
        .lt('fecha_devolucion', today)
        .eq('estatus', 'Pendiente')

    if (updateError) {
        console.error('Error updating loan status:', updateError)
        return
    }

    console.log(`${updatedLoans?.length || 0} préstamos actualizados a "Atrasado"`)
}

