# Gator

Gator is a command-line RSS feed aggregator written in TypeScript. It lets multiple local users register, add and follow RSS feeds, periodically scrape them, and browse the posts that come in.

## Requirements

- Node.js `22.15.0` (see `.nvmrc` — if you use `nvm`, run `nvm use`)
- A running PostgreSQL database
- npm

## Installation

1. Clone/extract the repo and install dependencies:

   ```bash
   npm install
   ```

2. Create a config file at `~/.gatorconfig.json` with your database connection string:

   ```json
   {
     "db_url": "postgres://username:password@localhost:5432/gator"
   }
   ```

   Gator reads and writes this file to track your database URL and which user is currently logged in (`current_user_name` is added automatically once you log in).

3. Run the database migrations:

   ```bash
   npm run migrate
   ```

   This applies the SQL migrations in `src/lib/db` to create the `users`, `feeds`, `feed_follows`, and `posts` tables.

## Running commands

Gator is run via `tsx` through npm's `start` script. Any arguments after `start --` are passed through as the command and its arguments:

```bash
npm run start -- <command> [args...]
```

## Commands

| Command     | Arguments             | Login required | Description                                                            |
| ----------- | --------------------- | :------------: | ---------------------------------------------------------------------- |
| `register`  | `<name>`              |       –        | Create a new user and log in as them                                   |
| `login`     | `<name>`              |       –        | Switch the current user (must already exist)                           |
| `users`     | –                     |       –        | List all registered users, marking the current one                     |
| `reset`     | –                     |       –        | Delete all users (cascades to their feeds, follows, and posts)         |
| `addfeed`   | `<name> <url>`        |       ✅       | Add a new RSS feed and automatically follow it                         |
| `feeds`     | –                     |       –        | List every feed added by any user                                      |
| `follow`    | `<url>`               |       ✅       | Follow an existing feed by its URL                                     |
| `unfollow`  | `<url>`               |       ✅       | Unfollow a feed you're currently following                             |
| `following` | –                     |       ✅       | List the feeds the current user follows                                |
| `agg`       | `<time_between_reqs>` |       –        | Start the aggregator loop (e.g. `1s`, `1m`, `1h`); runs until `Ctrl+C` |
| `browse`    | `[limit]`             |       ✅       | Show recent posts from followed feeds (`limit` defaults to `2`)        |

All commands are run as:

```bash
npm run start -- <command> [args...]
```

For example:

```bash
npm run start -- register alice
npm run start -- addfeed "Boot.dev Blog" https://blog.boot.dev/index.xml
npm run start -- follow https://blog.boot.dev/index.xml
npm run start -- agg 1m
npm run start -- browse 10
```

## Typical workflow

```bash
npm install
npm run migrate

npm run start -- register john
npm run start -- addfeed "TechCrunch" "https://techcrunch.com/feed/"

# In one terminal, start the aggregator so feeds get scraped periodically
npm run start -- agg 1m

# In another terminal, once some posts have come in
npm run start -- browse 5
```

## Project structure

```
src/
  index.ts               Entry point — registers commands and dispatches them
  config.ts               Reads/writes ~/.gatorconfig.json
  commands/                One file per command group (users, feeds, follow/unfollow, reset)
  lib/
    db/                    Drizzle schema, migrations, and query helpers
    rss/                   Feed fetching/parsing and the scrape loop used by `agg`
    middleware/             loggedIn.ts — wraps commands that require an active user
```

## Development

- `npm run generate` — generate a new Drizzle migration after changing `src/lib/db/schema.ts`
- `npm run migrate` — apply pending migrations
