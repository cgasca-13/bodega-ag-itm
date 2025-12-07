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

        // Verificar el token con el backend
        const response = await fetch('http://localhost:8080/api/auth/verify', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader!!
            }
        });

        if (!response.ok) {
            throw new Error('Token inválido');
        }

        const userData = await response.json();
        
        return NextResponse.json({
            success: true,
            nivel: userData.nivel,
            usuario: userData.usuario,
            nombre: userData.nombre
        }, { status: 200 });
        
    } catch {
        return NextResponse.json({
            success: false,
            message: "Error al verificar el nivel de acceso"
        }, { status: 401 });
    }
}
