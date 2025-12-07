import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const response = await fetch('http://localhost:8080/api/categorias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(body)
    });

    const responseText = await response.text();
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
      } catch {
        return NextResponse.json({ message: 'Categoría creada exitosamente' });
      }
    } else {
      return NextResponse.json({ error: 'Error al crear categoría' }, { status: response.status });
    }
  } catch {
    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 });
  }
}
