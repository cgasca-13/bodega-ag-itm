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

        const response = await fetch(`http://localhost:8080/api/usuarios/${id}/activar`, {
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
        let activatedUser;
        const responseText = await response.text();
        
        try {
            activatedUser = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
            // Si no es JSON, asumir éxito
            activatedUser = { message: 'Usuario activado' };
        }
        
        return NextResponse.json({
            success: true,
            usuario: activatedUser,
            message: "Usuario activado exitosamente"
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error al activar el usuario"
        }, { status: 500 });
    }
}
