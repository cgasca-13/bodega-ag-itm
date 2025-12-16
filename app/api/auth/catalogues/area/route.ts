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

        // Hacer la petición al backend con el token
        const response = await fetch(`${process.env.API_URL}/api/areas/activas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!!
            },
        });
        if (!response.ok) {
            throw new Error('Error al obtener áreas del backend');
        }

        const areas = await response.json();
        
        return NextResponse.json({
            success: true,
            areas: areas
        }, { status: 200 });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error al obtener las áreas"
        }, { status: 500 });
    }
}
