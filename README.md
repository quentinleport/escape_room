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
- Game session management system

## Game management system
All `/games` endpoints are JWT protected.

### Session lifecycle
- `waiting` -> `active` -> `finished`
- Only the host can move a session to `active` or `finished`
- A player can join only while the session is `waiting`

### Implemented endpoints
- `POST /games`: create a game session (creator becomes host and first player)
- `GET /games/:code`: get a session by code
- `POST /games/:code/players`: join a session as a player
- `PATCH /games/:code`: update session status (`active` or `finished`)
- `POST /games/:code/progress`: create or update current player's progress
- `GET /games/:code/progress/me`: get current player's submitted progress

### Stored game entities
- `GameSession`: code, status, hostId, playerIds, startedAt, finishedAt
- `GameProgress`: sessionId, userId, answers, score, completedAt