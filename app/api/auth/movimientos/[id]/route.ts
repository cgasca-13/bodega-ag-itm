import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

        const response = await fetch(`${process.env.API_URL}/api/movimientos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!
            }
        });

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: "Error al obtener el movimiento"
            }, { status: response.status });
        }

        const movimiento = await response.json();
        
        return NextResponse.json({
            success: true,
            data: movimiento
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: "Error interno del servidor"
        }, { status: 500 });
    }
}
