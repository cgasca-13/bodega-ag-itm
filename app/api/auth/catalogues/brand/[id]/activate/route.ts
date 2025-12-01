import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const { id } = await params;

    const response = await fetch(`http://localhost:8080/api/marcas/${id}/activar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });

    const responseText = await response.text();
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
      } catch {
        return NextResponse.json({ message: 'Marca activada exitosamente' });
      }
    } else {
      return NextResponse.json({ error: 'Error al activar marca' }, { status: response.status });
    }
  } catch {
    return NextResponse.json({ error: 'Error al activar marca' }, { status: 500 });
  }
}
