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

        const response = await fetch(`http://localhost:8080/api/areas/${id}/desactivar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
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
        let deactivatedArea;
        const responseText = await response.text();
        
        try {
            deactivatedArea = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
            // Si no es JSON, asumir éxito
            deactivatedArea = { message: 'Área desactivada' };
        }
        
        return NextResponse.json({
            success: true,
            area: deactivatedArea,
            message: "Área desactivada exitosamente"
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error al desactivar el área"
        }, { status: 500 });
    }
}
