import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { user, password } = await request.json();

  if (user === 'admin' && password === (process.env.ADMIN_PASSWORD || 'admin1234')) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set('wl_auth', 'admin', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24h
    });
    return response;
  }

  return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
}
