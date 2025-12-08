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

        const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!
            },
        });

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: "Error al obtener producto"
            }, { status: response.status });
        }

        const producto = await response.json();
        
        return NextResponse.json({
            success: true,
            data: producto
        });
    } catch (error) {
        console.error('Error en GET /api/productos/[id]:', error);
        return NextResponse.json({
            success: false,
            message: "Error interno del servidor"
        }, { status: 500 });
    }
}

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

        const { id } = await params;
        const body = await request.json();

        const response = await fetch(`http://localhost:8080/api/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: "Error al actualizar producto"
            }, { status: response.status });
        }

        const producto = await response.json();
        
        return NextResponse.json({
            success: true,
            data: producto,
            message: "Producto actualizado exitosamente"
        });
    } catch (error) {
        console.error('Error en PUT /api/productos/[id]:', error);
        return NextResponse.json({
            success: false,
            message: "Error interno del servidor"
        }, { status: 500 });
    }
}
