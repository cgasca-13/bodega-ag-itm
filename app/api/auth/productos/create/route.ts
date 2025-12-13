import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader) {
            return NextResponse.json({
                success: false,
                message: "Token no proporcionado"
            }, { status: 401 });
        }

        const body = await request.json();
        
        // Validar campos requeridos
        const { idArea, idCategoria, idMarca, noInv, idEstado } = body;
        
        if (!idArea || !idCategoria || !idMarca || !noInv || !idEstado) {
            return NextResponse.json({
                success: false,
                message: "Faltan campos obligatorios"
            }, { status: 400 });
        }

        const response = await fetch(`${process.env.API_URL}/api/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: "Error al crear producto"
            }, { status: response.status });
        }

        const producto = await response.json();
        
        return NextResponse.json({
            success: true,
            data: producto,
            message: "Producto creado exitosamente"
        });
    } catch (error) {
        console.error('Error en POST /api/productos/create:', error);
        return NextResponse.json({
            success: false,
            message: "Error interno del servidor"
        }, { status: 500 });
    }
}
