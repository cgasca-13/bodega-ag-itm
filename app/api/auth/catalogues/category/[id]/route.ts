import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    const { id } = await params;

    const response = await fetch(`http://localhost:8080/api/categorias/${id}`, {
      method: 'PUT',
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
        return NextResponse.json({ message: 'Categoría actualizada exitosamente' });
      }
    } else {
      return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: response.status });
    }
  } catch {
    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 });
  }
}
