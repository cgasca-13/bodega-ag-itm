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
        // El backend Java validará el token y los permisos
        const response = await fetch('http://localhost:8080/api/usuarios', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
        });
        
        if (!response.ok) {
            // Si el backend retorna 403, el usuario no tiene permisos
            if (response.status === 403) {
                return NextResponse.json({
                    success: false,
                    message: "No tiene permisos para acceder a este recurso"
                }, { status: 403 });
            }
            throw new Error('Error al obtener usuarios del backend');
        }

        const usuarios = await response.json();
        
        return NextResponse.json({
            success: true,
            usuarios: usuarios
        }, { status: 200 });
        
    } catch {
        return NextResponse.json({
            success: false,
            message: "Error al obtener los usuarios"
        }, { status: 500 });
    }
}
