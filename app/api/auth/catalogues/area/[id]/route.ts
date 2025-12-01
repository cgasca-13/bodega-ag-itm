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

        const response = await fetch(`http://localhost:8080/api/areas/${id}`, {
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
        let updatedArea;
        const responseText = await response.text();
        
        try {
            updatedArea = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
            // Si no es JSON, asumir éxito
            updatedArea = { message: 'Área actualizada' };
        }
        
        return NextResponse.json({
            success: true,
            area: updatedArea,
            message: "Área actualizada exitosamente"
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error al actualizar el área"
        }, { status: 500 });
    }
}
