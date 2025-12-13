import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();

    const response = await fetch(`${process.env.API_URL}/api/marcas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader!!
      },
      body: JSON.stringify(body)
    });

    const responseText = await response.text();
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
      } catch {
        return NextResponse.json({ message: 'Marca creada exitosamente' });
      }
    } else {
      return NextResponse.json({ error: 'Error al crear marca' }, { status: response.status });
    }
  } catch {
    return NextResponse.json({ error: 'Error al crear marca' }, { status: 500 });
  }
}
