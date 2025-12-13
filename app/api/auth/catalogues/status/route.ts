import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const response = await fetch(`${process.env.API_URL}/api/estados/activos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader!!
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Error al obtener estados' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Error al obtener estados' }, { status: 500 });
  }
}
