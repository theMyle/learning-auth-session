import { Hono } from "@hono/hono";
import { getCookie, setCookie } from "@hono/hono/cookie";

import { handleLogin, handleLogout, handleProfile } from "./login.ts";
import { LoginDto } from "./dto.ts";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/login", async (c) => {
  const credential: LoginDto = await c.req.json();

  const username = credential.username.trim().toLowerCase();
  const password = credential.password;

  const result = await handleLogin(username, password);
  if (!result.success) {
    c.json({ error: "invalid credentials" }, 401);
    return;
  }

  setCookie(c, "sessionId", result.session.id, {
    expires: result.session.expiresAt,
    secure: true,
    httpOnly: true,
    path: "/",
  });

  return c.body(null, 204);
});

app.post("/logout", (c) => {
  const sessionId = getCookie(c, "sessionId");
  if (sessionId) handleLogout(sessionId);

  setCookie(c, "sessionId", "", {
    secure: true,
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return c.body(null, 204);
});

app.get("/profile", (c) => {
  const sessionId = getCookie(c, "sessionId");

  if (!sessionId) {
    console.log("no sessionId");
    return c.body(null, 401);
  }

  const profile = handleProfile(sessionId);

  if (!profile) {
    console.log("no user profile");
    return c.json(null, 401);
  }

  return c.json(profile, 200);
});

Deno.serve(app.fetch);
