# Skill Spec Template

Output format for the discovery workflow. This template is filled during `/nvc:skill discover` and consumed by `/nvc:skill scaffold`.

---

```template
# Skill Spec: {skill-name}

## Identity

| Field | Value |
|-------|-------|
| Name | {skill-name} |
| Type | {skill-type} |
| Version | 0.1.0 |
| Category | {category} |
| Description | {description} |

## Persona

**Role:** [role definition — who this skill acts as]

**Style:**
- [communication style point 1]
- [communication style point 2]

**Expertise:**
- [domain expertise area 1]
- [domain expertise area 2]
- [domain expertise area 3]

## Activation

**What:** [what the skill does — 1-2 sentences]

**When to Use:**
- [trigger condition 1]
- [trigger condition 2]
- [trigger condition 3]

**Not For:**
- [scope boundary 1]
- [scope boundary 2]

## Commands

| Command | Description | Routes To |
|---------|-------------|-----------|
| /nvc:skill [command] | [what it does] | tasks/[task-file].md |

## Content Architecture

### Tasks
| File | Purpose | Loading |
|------|---------|---------|
| [task-name].md | [what workflow it guides] | on-command |

### Frameworks
| File | Purpose | Loading |
|------|---------|---------|
| [framework-name].md | [what domain knowledge it provides] | on-demand |

### Templates
| File | Purpose |
|------|---------|
| [template-name].md | [what structured output it produces] |

### Context
| File | Purpose | Loading |
|------|---------|---------|
| [context-name].md | [what user/business state it stores] | always |

### Checklists
| File | Purpose |
|------|---------|
| [checklist-name].md | [what quality gate it enforces] |

## NVC Integration

**Namespace:** {namespace-pattern}

**Reads at session start:**
- {key}: [what it contains]

**Writes autonomously after:**
| Event | Key | Content |
|-------|-----|---------|
| [event trigger] | {project}:{type} | [what gets saved] |

**Key conventions:**
| Key | Purpose |
|-----|---------|
| {project}:context | [stack, structure, commands] |
| {project}:progress | [current state, done, blocked] |

**Session lifecycle:** responds to /nvc:init and /nvc:end: [Yes/No]

## Notes

[Any additional decisions, considerations, or constraints captured during discovery]
```

---

## Field Documentation

### Placeholder Conventions

| Placeholder | Convention | Example |
|-------------|-----------|---------|
| `{curly-braces}` | Variable interpolation — replaced with exact user input | `{skill-name}` → `revops-expert` |
| `[square-brackets]` | Human-written prose — replaced with descriptive text | `[role definition]` → `Senior revenue operations strategist` |

### Conditional Sections

| Section | When to Include |
|---------|----------------|
| Commands | Always for `suite` and `standalone`. Omit for `task-only`. |
| Tasks | Include if skill has guided workflows. Most skills do. |
| Frameworks | Include if skill carries domain knowledge. |
| Templates | Include if skill produces structured output. |
| Context | Include if skill needs to remember state between sessions. |
| Checklists | Include if skill has quality gates or validation steps. |
| NVC Integration | Include if skill reads/writes NeuralVaultCore MCP. Omit if no NVC usage. |

### NVC Integration Fields

| Field | Required | Purpose | Example |
|-------|----------|---------|---------|
| `{namespace-pattern}` | Yes (if NVC) | NVC namespace format | `project:{repo-name}` |
| Reads at session start | Yes (if NVC) | What to load via get_context() | `{project}:context` |
| Writes autonomously | Yes (if NVC) | Auto-save triggers and keys | Feature done → `{project}:progress` |
| Key conventions | Yes (if NVC) | Standard key list | `{project}:plan-{name}` |
| Session lifecycle | Yes (if NVC) | /nvc:init and /nvc:end response | Yes |
