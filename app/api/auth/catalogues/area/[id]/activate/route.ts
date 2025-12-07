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
        
        console.log('ID recibido para activar:', id);

        const response = await fetch(`http://localhost:8080/api/areas/${id}/activar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error del backend:', errorText);
            throw new Error('Error al activar área en el backend');
        }

        const activatedArea = await response.json();
        
        return NextResponse.json({
            success: true,
            area: activatedArea,
            message: "Área activada exitosamente"
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error al activar el área"
        }, { status: 500 });
    }
}
