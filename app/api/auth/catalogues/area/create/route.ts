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

        const response = await fetch('http://localhost:8080/api/areas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('Error al crear área en el backend');
        }

        const newArea = await response.json();
        
        return NextResponse.json({
            success: true,
            area: newArea,
            message: "Área creada exitosamente"
        }, { status: 201 });
        
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Error al crear el área"
        }, { status: 500 });
    }
}
