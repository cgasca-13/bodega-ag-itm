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

        // Obtener el FormData del request
        const formData = await request.formData();
        
        // Validar campos requeridos
        const noInv = formData.get('noInv');
        const idArea = formData.get('idArea');
        const idCategoria = formData.get('idCategoria');
        const idMarca = formData.get('idMarca');
        const idEstado = formData.get('idEstado');
        
        if (!idArea || !idCategoria || !idMarca || !noInv || !idEstado) {
            return NextResponse.json({
                success: false,
                message: "Faltan campos obligatorios"
            }, { status: 400 });
        }

        // Enviar el FormData directamente al backend de Spring Boot
        // El backend se encargará de subir la imagen a Cloudinary
        const response = await fetch(`${process.env.API_URL}/api/productos`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader!
                // No incluir Content-Type, fetch lo setea automáticamente con el boundary correcto
            },
            body: formData
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
