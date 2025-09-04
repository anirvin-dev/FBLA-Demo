# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a pnpm monorepo using Turbo for task orchestration. Always use `pnpm` as the package manager.

### Core Commands

- `pnpm install` - Install dependencies for entire project
- `pnpm dev` - Start all applications in development mode
- `pnpm dev:scouting` - Start only the web app (`@app/web`)
- `pnpm dev:attendance` - Start only the attendance app (`@app/plus`)
- `pnpm build` - Build all applications
- `pnpm test` - Run tests across all packages
- `pnpm lint` - Run linting across all packages
- `pnpm lint:fix` - Fix linting issues across all packages
- `pnpm format` - Check code formatting
- `pnpm format:fix` - Fix code formatting
- `pnpm db:start` - Start local database (Docker required)

### Application-Specific Commands

For the web app (`apps/web`):

- `pnpm dev --filter=@app/web` - Start web app only
- `pnpm build --filter=@app/web` - Build web app only
- `pnpm lint --filter=@app/web` - Lint web app only

For basecamp (`apps/basecamp`):

- `pnpm dev --filter=basecamp` - Start NestJS Discord bot
- `pnpm test --filter=basecamp` - Run basecamp tests

## Architecture Overview

### Monorepo Structure

- `apps/web/` - Next.js 15 scouting application with React 19
- `apps/basecamp/` - NestJS Discord bot for team management
- `packages/ui/` - Shared React component library using shadcn/ui
- `packages/yeti-blue-sdk/` - TypeScript SDK for The Blue Alliance API
- `packages/database/` - Shared database package
- `packages/eslint-config/` - Shared ESLint configurations
- `packages/typescript-config/` - Shared TypeScript configurations

### Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, shadcn/ui components
- **Backend**: NestJS (Discord bot), Next.js API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js v5 with Discord OAuth
- **Build System**: Turbo monorepo with pnpm workspaces
- **Styling**: Tailwind CSS with custom theme system

### Key Architecture Patterns

#### Database Schema (`apps/web/lib/database/schema.ts`)

- User roles: admin, user, guest, banished
- NextAuth.js tables for authentication
- Scouting forms and match data schemas
- Uses Drizzle ORM with PostgreSQL

#### Authentication (`apps/web/lib/auth/`)

- Discord OAuth integration via NextAuth.js v5
- Role-based access control with UserRole enum
- Guild nickname integration for team member identification

#### Scouting System (`apps/web/app/(sidebar)/scout/`)

- Multi-step form system for robot performance data collection
- Form steps: Match Detail, Auto Period, Teleop Period, Endgame, Miscellaneous
- Real-time form validation with react-hook-form and Zod
- Progress tracking and navigation between form steps

#### Data Analysis (`apps/web/app/(sidebar)/analysis/`)

- Team performance analytics
- Tournament data visualization
- Advanced data tables with sorting and filtering

### Environment Configuration

Two `.env.local` files required:

- `apps/web/.env.local` - Next.js frontend config (copy from `.env.example`)
- `packages/database/.env.local` - Database config (copy from `.env.example`)

### Database Setup

- Docker Desktop recommended for automatic database startup
- Manual PostgreSQL setup supported via `DATABASE_URL` configuration
- Database starts automatically with `pnpm dev` when Docker is available

### Testing Strategy

- Jest for unit testing (basecamp app includes comprehensive test setup)
- Uses `--passWithNoTests` flag to prevent failures on missing tests
- E2E testing configuration available in basecamp app

### Key External Integrations

- **The Blue Alliance API**: Team and match data via yeti-blue-sdk
- **Discord**: OAuth authentication and bot integration
- **Google Sheets**: Data export and attendance tracking (basecamp)
- **AI Services**: Google GenAI integration for handbook Q&A (basecamp)

## Discord Bot Development

For detailed information about the Basecamp Discord bot architecture and code flow, see @docs/basecamp-system-architecture.md

### Key Documentation Resources

- **Necord Documentation**: <https://necord.org/> - Official NestJS integration for Discord.js
- **Discord.js Guide**: <https://discordjs.guide/> - Comprehensive Discord.js documentation
- **Discord.js Response Methods**: <https://discordjs.guide/slash-commands/response-methods> - Interaction responses and ephemeral messages
- **NestJS Documentation**: <https://docs.nestjs.com/> - Progressive Node.js framework

### Important Patterns for Discord Bot Development

#### Ephemeral Responses

Discord.js supports ephemeral responses that are only visible to the command executor:

```typescript
return interaction.reply({
  content: 'Your response message',
  flags: [MessageFlags.Ephemeral],
});
```

#### Slash Command Structure (Necord)

```typescript
@SlashCommand({
  name: 'command-name',
  description: 'Command description',
  dmPermission: true/false
})
public async onCommandName(@Context() [interaction]: SlashCommandContext) {
  return interaction.reply('Response');
}
```

#### Key Constraints

- Must respond to interactions within 3 seconds
- Cannot change ephemeral state after initial response
- Interaction tokens valid for 15 minutes after initial response

# Basecamp System Architecture

This document describes the architecture and code flow of the Basecamp Discord bot, built with NestJS and Necord.

## Technology Stack

- **NestJS v11.1.5**: Progressive Node.js framework providing dependency injection and modular architecture
- **Necord v6.9.1**: Official NestJS integration for Discord.js, providing decorators and deep framework integration
- **Discord.js v14.21.0**: Core Discord API library for bot functionality
- **Zod v3.25.76**: TypeScript-first schema validation for data handling

## Application Structure

### Module Hierarchy

```
AppModule
├── ConfigModule (global)
├── BotModule
│   ├── NecordModule (Discord.js integration)
│   ├── DataModule
│   │   ├── AttendanceModule
│   │   └── OutreachModule
│   └── HandbookModule
├── SheetModule (Google Sheets integration)
├── AiModule (Google GenAI integration)
└── HandbookModule
```

### Core Components

#### BotModule (`src/bot/bot.module.ts`)

- Configures NecordModule with Discord token and intents
- Uses `IntentsBitField.Flags.Guilds` for basic guild access
- Supports development guild configuration via `DEV_GUILD_ID`
- Provides BotCommands service for slash command handling

#### BotCommands (`src/bot/bot.commands.ts`)

- Central service containing all slash command handlers
- Uses Necord decorators: `@SlashCommand`, `@Context`, `@Options`
- Implements rate limiting for handbook commands
- Integrates with AttendanceService, OutreachService, and HandbookService

### Slash Command Architecture

#### Command Registration Pattern

```typescript
@SlashCommand({
  name: 'command-name',
  description: 'Command description',
  dmPermission: true/false
})
public async onCommandName(@Context() [interaction]: SlashCommandContext) {
  return interaction.reply('Response');
}
```

#### Available Commands

- `/ping` - Bot latency check (ephemeral)
- `/signin` - Attendance sign-in (ephemeral)
- `/signout` - Attendance sign-out (ephemeral)
- `/attendance` - View personal attendance hours
- `/outreach` - View personal outreach progress
- `/leaderboard` - Top 5 outreach members
- `/handbook` - AI-powered handbook Q&A (with rate limiting)

### Data Flow

#### Interaction Lifecycle

1. Discord user executes slash command
2. Discord API sends interaction to bot
3. Necord routes interaction to appropriate `@SlashCommand` handler
4. Handler processes request using injected services
5. Response sent via `interaction.reply()`

#### Service Integration

- **AttendanceService**: Google Sheets integration for meeting attendance tracking
- **OutreachService**: Outreach hours tracking and leaderboard functionality
- **HandbookService**: AI-powered Q&A using Google GenAI
- **SheetService**: Google Sheets API wrapper for data persistence

### Configuration Management

#### Environment Variables

- `DISCORD_TOKEN`: Bot authentication token
- `DEV_GUILD_ID`: Development server ID for testing
- `ATTENDANCE_SPREADSHEET_ID`: Google Sheets ID for attendance data
- Additional Google API and AI service credentials

#### NestJS Configuration

- Uses `ConfigModule.forRoot({ isGlobal: true })` for environment management
- Services inject `ConfigService` for runtime configuration access

### Error Handling and Logging

#### Patterns

- Injectable Logger service used throughout components
- Try-catch blocks around service operations
- User-friendly error messages for interaction responses
- Detailed error logging for debugging

#### Rate Limiting

- Global rate limiting implemented for handbook commands
- Request tracking with cleanup intervals
- Configurable limits and time windows

### Integration Patterns

#### Discord.js Context Handling

- `@Context()` decorator extracts interaction context
- Type-safe SlashCommandContext for interaction handling
- Guild member resolution for nickname requirements

#### NestJS Dependency Injection

- Constructor injection for service dependencies
- Proper service scoping and lifecycle management
- Module-based organization with clear boundaries

### Key Architectural Decisions

1. **Modular Design**: Clear separation between bot commands and business logic services
2. **Service Layer**: Abstracted data access through dedicated service classes
3. **Configuration Management**: Centralized environment variable handling
4. **Error Boundaries**: Graceful error handling with user feedback
5. **Type Safety**: Strong TypeScript typing throughout the application

## Command Response Patterns

### Standard Responses

```typescript
return interaction.reply('Response message');
```

### Ephemeral Responses (Private)

```typescript
return interaction.reply({
  content: 'Response message',
  flags: [MessageFlags.Ephemeral],
});
```

### Error Responses

```typescript
return interaction.reply({
  content: 'Error message',
  flags: [MessageFlags.Ephemeral],
});
```

This architecture provides a scalable, maintainable foundation for the Basecamp Discord bot with clear separation of concerns and robust error handling.
