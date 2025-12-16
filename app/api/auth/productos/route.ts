import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // Obtener el token del header de autorización
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader) {
            return NextResponse.json({
                success: false,
                message: "Token no proporcionado"
            }, { status: 401 });
        }

        // Obtener parámetros de paginación si existen
        const searchParams = request.nextUrl.searchParams;
        const page = searchParams.get('page');
        const size = searchParams.get('size');

        // Construir URL del backend
        let backendUrl = `${process.env.API_URL}/api/productos`;
        if (page !== null && size !== null) {
            backendUrl = `${process.env.API_URL}/api/productos/paginado?page=${page}&size=${size}`;
        }

        // Hacer la petición al backend con el token
        const response = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!
            },
        });
        
        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: "Error al obtener productos del backend"
            }, { status: response.status });
        }

        const productos = await response.json();
        
        return NextResponse.json({
            success: true,
            data: productos
        });
    } catch (error) {
        console.error('Error en GET /api/productos:', error);
        return NextResponse.json({
            success: false,
            message: "Error interno del servidor"
        }, { status: 500 });
    }
}
