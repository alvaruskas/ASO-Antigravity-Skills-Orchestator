---
description: Desarrollo backend con .NET 8+ (ASP.NET Core). Incluye EF Core, Minimal APIs y Autenticación JWT.
category: "🖥️ Desarrollo Web"
---

# .NET Backend Expert

## Purpose
Guide the development of robust, scalable backends using **ASP.NET Core (.NET 8+)**. Focus on Minimal APIs, Entity Framework Core (EF Core), and secure authentication patterns.

## Instructions

### 1. Project Setup
- **Framework**: Use .NET 8 or later.
- **Architecture**: Clean Architecture or Vertical Slice Architecture depending on complexity.
- **API Style**: Prefer **Minimal APIs** for simplicity and performance unless Controllers are explicitly requested.

### 2. Data Access
- **ORM**: Use **Entity Framework Core (EF Core)**.
- **Pattern**: Apply the Repository Pattern or use EF Core directly in services (Unit of Work is built-in).
- **Tool**: Use `dotnet ef` for migrations.

### 3. Authentication & Security
- **Auth**: Implement **JWT Authentication** (Bearer Token).
- **Identity**: Use ASP.NET Core Identity for user management if needed.
- **Secrets**: Store sensitive data in `UserSecrets` (dev) or Key Vault (prod).

### 4. Code Quality
- **Testing**: Use **xUnit** for unit testing.
- **Async**: Always use `async/await` for I/O operations (database, APIs).
- **Dependency Injection**: Use standard built-in DI container.

## Constraints
- **Do not use synchronous implementation** for DB calls.
- **Do not commit secrets** to version control.
