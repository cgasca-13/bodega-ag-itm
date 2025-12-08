import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { usuario, contrasena } = await request.json();
        
        // Validar credenciales con tu base de datos
        // const user = await validateUser(username, password);
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
            usuario,
            contrasena 
            })
        });

        if (!response.ok) {
            throw new Error('Authentication failed');
        }

        const user = await response.json();
        // Generar token
        const token = user.token;
        
        return NextResponse.json({
        success: true,
        token,
        user: { 
            usuario,
            nombre: user.nombre || usuario, // Devolver nombre o usuario como fallback
            nivel: user.nivel || 2 // Devolver nivel de acceso
        }
        }, { status: 200 });
        
    } catch {
        return NextResponse.json({
        success: false,
        message: "Error de autenticación"
        }, { status: 401 });
    }
}
