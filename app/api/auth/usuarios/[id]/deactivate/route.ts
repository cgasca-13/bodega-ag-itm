import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader) {
            return NextResponse.json({
                success: false,
                message: "Token no proporcionado"
            }, { status: 401 });
        }

        const { id } = await params;

        const response = await fetch(`${process.env.API_URL}/api/usuarios/${id}/desactivar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            
            return NextResponse.json({
                success: false,
                message: `Error del backend: ${errorText}`,
                status: response.status
            }, { status: response.status });
        }

        // Intentar parsear la respuesta
        let deactivatedUser;
        const responseText = await response.text();
        
        try {
            deactivatedUser = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
            // Si no es JSON, asumir éxito
            deactivatedUser = { message: 'Usuario desactivado' };
        }
        
        return NextResponse.json({
            success: true,
            usuario: deactivatedUser,
            message: "Usuario desactivado exitosamente"
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error al desactivar el usuario"
        }, { status: 500 });
    }
}
