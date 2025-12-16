import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        
        if (!authHeader) {
            return NextResponse.json({
                success: false,
                message: "Token no proporcionado"
            }, { status: 401 });
        }

        // Obtener parámetros de filtro de la URL
        const { searchParams } = new URL(request.url);
        const usuario = searchParams.get('usuario');
        const fecha = searchParams.get('fecha');

        // Construir URL con parámetros
        let apiUrl = `${process.env.API_URL}/api/movimientos`;
        const params = new URLSearchParams();
        
        if (usuario) params.append('usuario', usuario);
        if (fecha) params.append('fecha', fecha);
        
        if (params.toString()) {
            apiUrl += `?${params.toString()}`;
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!
            }
        });

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: "Error al obtener movimientos"
            }, { status: response.status });
        }

        const movimientos = await response.json();
        
        return NextResponse.json({
            success: true,
            data: movimientos
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: "Error interno del servidor"
        }, { status: 500 });
    }
}
