# AGENTS.md

## Project Engineering Contract

This repository follows a versioned Engineering Standard.

The Engineering Standard is the source of truth for architecture, security, quality, development practices and project conventions. This file provides the minimum context an AI must always follow when working in this repository.

---

## 1. Core Principles

Build software that is:

* correct;
* secure;
* reliable;
* maintainable;
* testable;
* understandable;
* appropriately simple.

Follow:

> Standardize what should be standardized.
> Abstract what should be abstracted.
> Keep simple what should remain simple.
> Automate what should be automated.
> Validate what matters.
> Allow justified exceptions.

Prefer explicit decisions over implicit assumptions.

Do not introduce complexity without a concrete engineering reason.

---

## 2. Source of Truth

The project must declare its Engineering Standard version and active capabilities.

```text
Engineering Standard
        +
Project Configuration
        +
Capabilities
        +
Approved Exceptions
        ↓
Effective Standard
```

When a rule, architecture decision or convention is unclear:

1. inspect the project configuration;
2. inspect the applicable standard;
3. inspect relevant policies/rules/patterns;
4. inspect the appropriate Skill or Agent;
5. ask the user when critical information is still missing.

Never invent project rules, APIs, dependencies or architectural decisions.

---

## 3. Architecture

Default architecture:

```text
Modular Monolith
+
Feature-oriented Architecture
+
Server-first Next.js
```

Organize primarily by feature.

Keep dependency direction explicit:

```text
app
 ↓
features
 ↓
domain / application
 ↓
ports / boundaries when useful
 ↓
infrastructure
 ↓
external services
```

Domain logic must not depend directly on framework or infrastructure details unless there is a justified reason.

Do not create layers, abstractions, services or patterns merely because they are available in the standard.

> Introduce complexity when it solves a real problem.

---

## 4. Implementation Rules

Prefer:

* TypeScript with strict typing;
* server-side logic by default;
* validated inputs;
* explicit error handling;
* small cohesive modules;
* low coupling;
* reusable components where reuse is real;
* abstractions only where they provide value;
* configuration separated from implementation;
* existing project conventions over new conventions.

Avoid:

* speculative abstractions;
* unnecessary dependencies;
* duplicated responsibilities;
* hidden side effects;
* silent error handling;
* premature optimization;
* unnecessary infrastructure;
* introducing equivalent libraries for an existing responsibility.

---

## 5. Security

Security is part of design, not a final step.

Always consider:

* authentication;
* authorization;
* input validation;
* data access;
* secrets;
* sensitive information;
* external integrations;
* dependency/security risks;
* least privilege.

Never trust external input.

Never expose secrets.

Never treat UI visibility as authorization.

When using database access controls, ensure application behavior and database security are consistent.

---

## 6. Reliability

For non-trivial functionality, consider:

* invalid input;
* missing resources;
* authentication/authorization failures;
* external service failures;
* timeouts;
* retries;
* rate limits;
* duplicate operations;
* concurrency;
* partial failures;
* inconsistent state.

Retries must be bounded and safe.

Operations with side effects should consider idempotency.

---

## 7. Validation

Code is not considered complete because it compiles.

Minimum expectation:

```text
Implementation
 ↓
Typecheck
 ↓
Lint / Format
 ↓
Relevant Tests
 ↓
Security / Edge Cases
 ↓
Done
```

Validation depth must be proportional to risk.

Pay particular attention to:

* authentication;
* authorization;
* billing;
* webhooks;
* sensitive data;
* critical mutations;
* core user flows.

> Implementation + Validation = Done

---

## 8. Change Discipline

Before making a significant change:

1. understand the existing architecture;
2. identify affected features and boundaries;
3. inspect relevant rules and patterns;
4. choose the simplest valid solution;
5. implement incrementally;
6. validate;
7. document significant decisions.

Do not rewrite working architecture without a concrete reason.

Do not silently change established conventions.

Significant architectural decisions should be recorded as ADRs when appropriate.

---

## 9. AI Working Model

The AI acts as an engineering collaborator, not as an autonomous source of architectural authority.

The AI should:

* understand before modifying;
* inspect existing code before creating new code;
* reuse existing capabilities;
* follow the Effective Standard;
* validate its work;
* make assumptions explicit;
* surface risks and trade-offs;
* stop and request user input when a critical decision cannot be determined safely.

Use specialized Skills and Agents for specialized work.

Use Tools for explicit operations.

Do not bypass project rules because a direct implementation appears easier.

---

## 10. Decision Priority

When making implementation decisions, prioritize:

```text
Correctness
→ Security
→ Reliability
→ Maintainability
→ Testability
→ Simplicity
→ Performance
→ Scalability
→ Developer Experience
→ Operational Cost
```

Do not optimize for performance or scalability without evidence of a real requirement.

Distinguish:

* requirement;
* constraint;
* risk;
* trade-off;
* preference;
* optimization.

Do not turn personal preference into an architectural rule.

---

## 11. Project Boundary

Project-specific decisions belong to the project.

Do not modify the global Engineering System to solve a local project problem.

When the project intentionally deviates from the standard:

```text
Identify rule
→
Justify deviation
→
Assess impact
→
Document exception
→
Validate
```

An exception is local unless the Engineering Standard itself is intentionally changed.

---

## 12. Completion Standard

A task is complete when:

* requirements are satisfied;
* architecture remains coherent;
* security has been considered;
* relevant edge cases are handled;
* appropriate tests exist;
* quality gates pass;
* important assumptions are documented;
* no unnecessary complexity has been introduced.

When uncertain, prefer making the uncertainty explicit over silently guessing.

---

## 13. Final Rule

> Build reusable engineering capabilities, not disposable solutions.

The goal is not to generate more code.

The goal is to build a robust product that follows an explicit, versioned and validated Engineering Standard.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
