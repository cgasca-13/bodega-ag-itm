import { NextRequest, NextResponse } from "next/server";

export async function PUT(
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

        const body = await request.json();
        const { id } = await params;

        const response = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(body)
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
        let updatedUser;
        const responseText = await response.text();
        
        try {
            updatedUser = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
            // Si no es JSON, asumir éxito
            updatedUser = { message: 'Usuario actualizado' };
        }
        
        return NextResponse.json({
            success: true,
            usuario: updatedUser,
            message: "Usuario actualizado exitosamente"
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error al actualizar el usuario"
        }, { status: 500 });
    }
}
