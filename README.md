# Escape room backend
Demo project - backend for multiplayer live games with chat functionality


## Key Techs :robot:
- Nest.js
- MongoDb
- WebSocket


## Current status
- User schema implemented (email, passwordHash, displayName, role)
- Auth module: register, login endpoints + JWT token signing
- JWT strategy with Passport.js (`AuthGuard('jwt')`)
- `JwtAuthGuard` and `@CurrentUser()` decorator for protected routes
- `GET /auth/me` protected endpoint