import { cookies } from "next/headers";

export const SESSION_COOKIE = "dutcheyy_session";

export async function readSession() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { email?: string; name?: string };
    if (!parsed.email) return null;
    return { email: parsed.email, name: parsed.name || parsed.email };
  } catch {
    return null;
  }
}

export async function writeSession(name: string, email: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, JSON.stringify({ name, email }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
