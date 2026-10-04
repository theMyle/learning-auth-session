- I started scafolding the stores. One for Users and one for the Sessions.
- I stumbled accross password hashing and to why we don't store passwords as
  plaintext in DB so we must hash + salt.
- Salt is randomly generated when creating password hash.
- You need to store salt + password hash since salt is needed for veryfying
  password.
- I went with an in memory store for ease of implementation since my focus in
  understanding sessions. Not necessarily db or frameworks.
