# 🛠️ NeuralSkillBuilder

> Build consistent, NeuralVault-integrated Claude Code skills.

Meta-skill for creating, scaffolding, and auditing Claude Code skills — with built-in NeuralVaultCore MCP integration. Based on [Skillsmith](https://github.com/ChristopherKahler/skillsmith) conventions (MIT), extended for the NeuralVault ecosystem.

![License](https://img.shields.io/badge/License-MIT-0D1117?style=flat-square&logo=opensourceinitiative&logoColor=4CAF50)
![Ecosystem](https://img.shields.io/badge/Ecosystem-NeuralVault-0D1117?style=flat-square&logo=anthropic&logoColor=9F7AEA)
![Platform](https://img.shields.io/badge/Platform-Claude_Code-0D1117?style=flat-square&logo=anthropic&logoColor=4488FF)

---

## 🚀 Install

```bash
npx @getobyte/neural-skill-builder
```

```bash
npx @getobyte/neural-skill-builder --global   # available in every workspace
npx @getobyte/neural-skill-builder --local    # current project only
```

Then open Claude Code and type `/nvc:skill`.

---

## 🧩 Commands

| Command | What it does |
|---------|-------------|
| `/nvc:skill discover` | Guided interview to design a new skill — produces a skill spec |
| `/nvc:skill scaffold` | Generate a compliant skill directory from a spec |
| `/nvc:skill distill` | Transform raw source material into framework chunks |
| `/nvc:skill audit` | Audit skill compliance against syntax specs |

---

## ⚙️ How It Works

Claude Code skills are markdown files that give Claude a persona, routing logic, and domain knowledge. NeuralSkillBuilder enforces a consistent structure across all skills using standardized syntax specs.

**Four workflows:**

**1. Discover** — 6-phase guided interview covering identity, persona, scope, content architecture, NVC integration, and review. Produces a structured skill spec.

**2. Scaffold** — Takes a skill spec, generates a complete directory with all files properly structured. Auto-generates `frameworks/nvc-tools.md` when NVC integration is present.

**3. Distill** — Transforms raw knowledge (books, courses, notes) into structured framework chunks ready for skill consumption.

**4. Audit** — Checks existing skills against syntax specs and NVC conventions. Produces a scored compliance report.

---

## 🧠 NVC Integration (Phase 5)

The discovery workflow includes a dedicated phase for designing how your skill integrates with NeuralVaultCore MCP:

- Which keys does the skill read at session start?
- Which events trigger autonomous NVC writes?
- What namespace convention does the skill use?
- Does the skill respond to `/nvc:init` and `/nvc:end`?

When NVC integration is present, scaffold auto-generates `frameworks/nvc-tools.md` with all tool signatures, namespace conventions, key conventions, and token efficiency rules.

---

## 📁 Skill File Types

| Type | Purpose | Mutable? |
|------|---------|:--------:|
| Entry point | Identity + routing | ✗ |
| Tasks | Guided workflows | ✗ |
| Frameworks | Domain knowledge | ✗ |
| Templates | Output structure | ✗ |
| Context | User / business state | ✓ |
| Checklists | Quality gates | ✗ |

---

## 🌐 NeuralVault Ecosystem

| Component | Role |
|-----------|------|
| 🧠 [**NeuralVaultCore**](https://github.com/getobyte/NeuralVaultCore) | MCP memory server — the brain |
| ⚡ [**NeuralVaultSkill**](https://github.com/getobyte/NeuralVaultSkill) | Session memory automation — `/nvc:init` + `/nvc:end` |
| 🧹 [**NeuralVaultArchivist**](https://github.com/getobyte/NeuralVaultArchivist) | Memory consolidation — on-demand cleanup |
| 🛠️ **NeuralSkillBuilder** *(you are here)* | Skill builder — design, scaffold, audit |

---

## Credits

Based on [Skillsmith](https://github.com/ChristopherKahler/skillsmith) by Chris Kahler (MIT License).  
Extended for the NeuralVault ecosystem by [getobyte](https://github.com/getobyte).

---

<div align="center">

**NeuralSkillBuilder** — Cyber-Draco Legacy  
Built by [getobyte](https://github.com/getobyte) · Romania 🇷🇴

</div>