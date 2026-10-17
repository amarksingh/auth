# @ostro/auth — Antigravity AI Architecture & Knowledge Base

> **Package Name**: `@ostro/auth`
> **Version**: `2.0.0-alpha.1`
> **Role in Ecosystem**: Modular Core Framework Library

---

## 1. Package Purpose & Overview
Authentication and authorization subsystems providing user sessions, guard strategies, password hashing, and token providers.

- **Primary Architectural Patterns**: Manager/Driver pattern, event-driven auth lifecycle, middleware integration (`startAuth`).
- **Key Exported Entities**: `AuthManager`, `SessionGuard`, `TokenGuard`, `GenericUser`, `Authorizable`

---

## 2. Dependencies & Interoperability
- **Direct Dependencies**:
  - `@ostro/contracts`: `^1.0.2`
  - `@ostro/support`: `^1.0.11`
  - `commander`: `^15.0.0`
  - `string-argv`: `^0.3.2`
  - `uid-safe`: `^2.1.5`
- **Framework Consumers**: Consumed across the OstroJS ecosystem via `@ostro/framework` and direct imports.

---

## 3. Directory & Source Layout
```text
origin/auth/
├── authManager.ts
├── authRequest.ts
├── authServiceProvider.ts
├── authenticatable.ts
├── authenticationException.ts
├── createsUserProviders.ts
├── databaseUserProvider.ts
├── eloquentUserProvider.ts
├── genericUser.ts
├── guardHelpers.ts
├── middleware/authenticate.ts
├── middleware/redirectIfAuthenticated.ts
├── middleware/startAuth.ts
├── recaller.ts
├── sessionGuard.ts
├── tokenGuard.ts
```

---

## 4. TypeScript Typing & Code Standards
1. **Access Modifiers**: All class properties and methods declare explicit visibility (`public`, `protected`, `private`).
2. **Inheritance & Overrides**: Classes overriding base class methods use the `override` keyword to safeguard contracts.
3. **Immutability**: Constant lookup tables and static registries use `readonly` and strict record types.
4. **No Implicit Any**: Public APIs avoid `any` in favor of generics (`<T = unknown>`) and typed contracts from `@ostro/contracts`.
5. **Contract Binding**: Core managers implement contracts from `@ostro/contracts/auth/*`.

---

## 5. Development & Verification Guide
- **Compile / Build**: `npm run build` (runs `npx tsc -p tsconfig.build.json`)
- **Run Tests**: `npm test` (executes Jest with 100% coverage target via `c8`)
- **Published Artifacts**: Target output compiled to `./build` with accompanying `.d.ts` declarations and source maps.

---
*Generated for Antigravity AI high-speed codebase comprehension with minimal token consumption.*
