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
        const { motivo } = await request.json();

        if (!motivo || motivo.trim() === '') {
            return NextResponse.json({
                success: false,
                message: "El motivo de la baja es obligatorio"
            }, { status: 400 });
        }

        const response = await fetch(`${process.env.API_URL}/api/productos/${id}/desactivar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!
            },
            body: JSON.stringify({ motivo })
        });

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: "Error al dar de baja el producto"
            }, { status: response.status });
        }

        return NextResponse.json({
            success: true,
            message: "Producto dado de baja exitosamente"
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: "Error interno del servidor"
        }, { status: 500 });
    }
}
