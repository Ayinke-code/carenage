import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const key = new TextEncoder().encode(process.env.SESSION_SECRET);

export type Session = {
  userId: string;
  role: "OWNER" | "SHIPYARD" | "ADMIN";
  name: string;
};

export async function createSession(session: Session) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(key);

  (await cookies()).set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

// À appeler en haut d'une page protégée
export async function requireRole(...roles: Session["role"][]) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (roles.length > 0 && !roles.includes(session.role)) redirect("/dashboard");
  return session;
}

export async function destroySession() {
  (await cookies()).delete("session");
}