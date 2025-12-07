import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const { id } = await params;

    const response = await fetch(`http://localhost:8080/api/categorias/${id}/activar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader!
      }
    });

    const responseText = await response.text();
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
      } catch {
        return NextResponse.json({ message: 'Categoría activada exitosamente' });
      }
    } else {
      return NextResponse.json({ error: 'Error al activar categoría' }, { status: response.status });
    }
  } catch {
    return NextResponse.json({ error: 'Error al activar categoría' }, { status: 500 });
  }
}
