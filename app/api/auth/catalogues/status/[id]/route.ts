import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    const { id } = await params;

    const response = await fetch(`${process.env.API_URL}/api/estados/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader!
      },
      body: JSON.stringify(body)
    });

    const responseText = await response.text();
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
      } catch {
        return NextResponse.json({ message: 'Estado actualizado exitosamente' });
      }
    } else {
      return NextResponse.json({ error: 'Error al actualizar estado' }, { status: response.status });
    }
  } catch {
    return NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 });
  }
}
