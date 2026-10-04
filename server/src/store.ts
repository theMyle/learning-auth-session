import { hashPassword } from "./password.ts";

export interface User {
    id: string
    firstName: string
    lastName: string
    username: string
    email?: string
    passwordHash: string
}

export interface Session {
    id: string
    userId: string
    expiresAt: Date
}

const userStore = new Map<string, User>()
const sessionStore = new Map<string, Session>()

// seed
const passwordHash = await hashPassword("admin_password")

userStore.set('admin', {
    id: crypto.randomUUID(),
    firstName: "George",
    lastName: "Admin",
    username: "admin",
    passwordHash: passwordHash,
})

console.log(userStore)

export { userStore, sessionStore }
