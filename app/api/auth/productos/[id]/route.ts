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

        const response = await fetch(`${process.env.API_URL}/api/productos/${id}`, {
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
        
        // Intentar obtener FormData (si viene con archivo) o JSON
        const contentType = request.headers.get('content-type') || '';
        let formData: FormData;
        
        if (contentType.includes('multipart/form-data') || !contentType.includes('application/json')) {
            // Es FormData
            formData = await request.formData();
        } else {
            // Es JSON, convertir a FormData
            const body = await request.json();
            formData = new FormData();
            
            Object.keys(body).forEach(key => {
                if (body[key] !== undefined && body[key] !== null) {
                    formData.append(key, body[key].toString());
                }
            });
        }

        // Enviar FormData al backend
        const response = await fetch(`${process.env.API_URL}/api/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': authHeader!
                // No incluir Content-Type, fetch lo setea automáticamente
            },
            body: formData
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
