import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const { id } = await params;

    const response = await fetch(`${process.env.API_URL}/api/categorias/${id}/desactivar`, {
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
        return NextResponse.json({ message: 'Categoría desactivada exitosamente' });
      }
    } else {
      return NextResponse.json({ error: 'Error al desactivar categoría' }, { status: response.status });
    }
  } catch {
    return NextResponse.json({ error: 'Error al desactivar categoría' }, { status: 500 });
  }
}
