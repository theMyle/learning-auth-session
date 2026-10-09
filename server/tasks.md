- I started scafolding the stores. One for Users and one for the Sessions.
- I stumbled accross password hashing and to why we don't store passwords as
  plaintext in DB so we must hash + salt.
- Salt is randomly generated when creating password hash.
- You need to store salt + password hash since salt is needed for veryfying
  password.
- I went with an in memory store for ease of implementation since my focus in
  understanding sessions. Not necessarily db or frameworks.

- Store, password hasher, and password validator is done.
- Login endpoint is done.

- Login verifies credentials, creates a session and sends it back with `Set-Cookie` header.
- Logout should invalidate session and clear browser cookie.

- Get profile implemented. Uses the cookie's session ID to get user details.

- I can add registration as well!
