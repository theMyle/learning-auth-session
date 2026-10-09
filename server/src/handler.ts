import { createSession, Session, sessionStore, userStore } from "./store.ts";
import { verifyPassword } from "./password.ts";
import { ProfileDto } from "./dto.ts";

export type LoginResult =
  | { success: true; session: Session }
  | { success: false };

export async function handleLogin(
  username: string,
  password: string,
): Promise<LoginResult> {
  const user = userStore.get(username);

  if (!user) return { success: false };

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) return { success: false };

  const session = createSession(user.id);
  sessionStore.set(session.id, session);

  console.log(`session created:`);
  console.log(sessionStore.entries());

  return { success: true, session: session };
}

export function handleLogout(sessionId: string): boolean {
  if (sessionStore.delete(sessionId)) return true;
  return false;
}

export function handleProfile(sessionId: string): ProfileDto | null {
  const session = sessionStore.get(sessionId);

  if (!session) {
    console.log("session not found");
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    console.log("cookie is expired");
    sessionStore.delete(sessionId);
    return null;
  }

  const user = [...userStore.values()].find((user) =>
    user.id === session.userId
  );

  if (!user) {
    console.log("user not found");
    return null;
  }

  return {
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}
