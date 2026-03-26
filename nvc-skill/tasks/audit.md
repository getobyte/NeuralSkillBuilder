<purpose>
Assess existing skills against NeuralSkillBuilder syntax specs. Reads a skill's directory structure, checks each component against the corresponding spec, checks NVC integration compliance if applicable, and produces a structured compliance report with violations and remediation priorities.
</purpose>

<user-story>
As a skill builder, I want to audit existing skills against the syntax standards so that I can identify compliance gaps and fix them before distribution or deployment.
</user-story>

<when-to-use>
- Checking a skill for compliance after building or modifying it
- Quality gate before distributing a skill via GitHub
- Auditing legacy skills that predate the NeuralSkillBuilder standards
- Entry point routes here via /nvc:skill audit
</when-to-use>

<context>
@rules/entry-point-rules.md
@rules/tasks-rules.md
</context>

<references>
@../specs/entry-point.md (when assessing entry point compliance)
@../specs/tasks.md (when assessing task files)
@../specs/templates.md (when assessing template files)
@../specs/frameworks.md (when assessing framework files)
@../specs/context.md (when assessing context files)
@../specs/checklists.md (when assessing checklist files)
@../specs/rules.md (when assessing rules files)
</references>

<steps>

<step name="identify_target" priority="first">
Determine what to audit.

**Ask:**
1. **Skill path** — Provide the path to a skill directory, or say "batch" to audit all skills in a parent directory.

**Wait for response.**

**Single skill mode:**
1. Validate the path exists
2. Locate the entry point file:
   - Look for `{directory-name}.md` first (spec convention)
   - Fall back to `SKILL.md`, `skill.md`, or any single `.md` at root
   - If no entry point found: note as first violation
3. Confirm: "Auditing `{skill-name}` at `{path}`. Proceed?"

**Batch mode:**
1. Ask for the parent directory path
2. Discover all subdirectories that appear to be skills
3. List discovered skills and confirm: "Found {N} skills. Audit all?"

**Wait for confirmation before proceeding.**
</step>

<step name="inventory_structure">
Catalog what exists in the skill directory before checking compliance.

1. List all files and subdirectories
2. Classify each component:

| Component | Present? | Files | Maps to Spec |
|-----------|----------|-------|-------------|
| Entry point | Yes/No | {filename} | entry-point.md |
| tasks/ | Yes/No | {count} files | tasks.md |
| templates/ | Yes/No | {count} files | templates.md |
| frameworks/ | Yes/No | {count} files | frameworks.md |
| context/ | Yes/No | {count} files | context.md |
| checklists/ | Yes/No | {count} files | checklists.md |
| rules/ | Yes/No | {count} files | rules.md |

3. Identify the skill tier: suite / standalone / task-only
4. Check for `frameworks/nvc-tools.md` — note if present (signals NVC integration)
5. Note non-standard directories — informational, not violations

Display the inventory table before proceeding.
</step>

<step name="assess_entry_point">
Load @../specs/entry-point.md and check the entry point file against it.

**Check each requirement:**

**1. YAML Frontmatter:**
- [ ] Frontmatter present (delimited by `---`)
- [ ] `name` field present and kebab-case
- [ ] `type` field present and valid (suite, standalone, task-only)
- [ ] `version` field present and semver format
- [ ] `category` field present
- [ ] `description` field present and one-line

**2. XML Sections (check presence and order):**
- [ ] `<activation>` present with What, When to Use, Not For subsections
- [ ] `<persona>` present with Role, Style, Expertise subsections
- [ ] `<commands>` present (if not task-only) with table format
- [ ] `<routing>` present with Always Load / Load on Command / Load on Demand structure
- [ ] `<greeting>` present with available actions listed

**3. Conventions:**
- [ ] Entry point filename matches directory name
- [ ] Entry point is thin (routing, not process logic)
- [ ] Placeholders use correct convention ([square]=prose, {curly}=variable)
- [ ] @-references in routing point to existing files

**Score:** Count checks passed vs total applicable.
- All pass → **Compliant**
- 70%+ pass → **Partial**
- Below 70% → **Non-compliant**
</step>

<step name="assess_folder_types">
For each folder that maps to a spec, load the corresponding spec and check files.

**tasks/ — Check against specs/tasks.md:**
- [ ] No YAML frontmatter
- [ ] Has `<purpose>` section
- [ ] Has `<user-story>` in format: As a [role], I want [action], so that [outcome]
- [ ] Has `<when-to-use>` with trigger conditions
- [ ] Has `<steps>` with named steps (`<step name="snake_case">`)
- [ ] Steps use imperative voice
- [ ] Steps have explicit wait points where user input needed
- [ ] Has `<o>` section specifying artifacts
- [ ] Has `<acceptance-criteria>` as plain checklists

**templates/ — Check against specs/templates.md:**
- [ ] Has header `# {Name} Template`
- [ ] Uses placeholder convention consistently
- [ ] Has fenced template block
- [ ] Has Field Documentation table

**frameworks/ — Check against specs/frameworks.md:**
- [ ] No YAML frontmatter
- [ ] Has purpose section
- [ ] Has examples grounding the concepts
- [ ] Teaching orientation (not prescriptive instructions)

**context/ — Check against specs/context.md:**
- [ ] No frontmatter
- [ ] Clearly scoped to one domain of state
- [ ] Has placeholder values for empty fields
- [ ] Designed for session-to-session persistence

**checklists/ — Check against specs/checklists.md:**
- [ ] Uses checkbox format (`- [ ]` items)
- [ ] Each item independently verifiable
- [ ] Items have clear pass/fail criteria
- [ ] Organized by concern

**NVC Integration check (if frameworks/nvc-tools.md present):**
- [ ] Contains all 9 NVC MCP tool signatures
- [ ] Each tool has correct parameter list
- [ ] Namespace convention documented
- [ ] Key conventions listed
- [ ] Token efficiency rules present
- [ ] "Never Store" section present (no secrets rule)

**Score each folder:** Compliant / Partial / Non-compliant
</step>

<step name="generate_report">
Compile all findings into a structured compliance report.

```markdown
# Skill Audit Report: {skill-name}

**Path:** {skill-path}
**Tier:** {suite/standalone/task-only}
**Audit Date:** {date}
**Overall Score:** {N}% ({compliant-count}/{total-audited} components compliant)

---

## Summary

| Component | Spec | Status | Issues |
|-----------|------|--------|--------|
| Entry point | entry-point.md | {status} | {N} |
| tasks/ | tasks.md | {status} | {N} |
| frameworks/ | frameworks.md | {status} | {N} |
| nvc-tools.md | NVC conventions | {Compliant/Missing/N/A} | {N} |
| templates/ | templates.md | {status} | {N} |
| context/ | context.md | {status} | {N} |
| checklists/ | checklists.md | {status} | {N} |

---

## Violations Detail

### Entry Point
{For each failed check: what's wrong, where, and how to fix it}

### tasks/
{Per-file violations}

### NVC Integration
{nvc-tools.md violations if applicable}

---

## Remediation Priorities

1. {Highest impact — entry point structural issues}
2. {Next — missing required sections}
3. {Lower — convention violations}

---

*Generated by /nvc:skill audit*
```

**Ask:** "Where should I save this report?"
- Default: `{skill-path}/{skill-name}-AUDIT.md`

**Wait for response, then write the report.**
</step>

</steps>

<o>
## Artifacts
- Individual audit report: `{skill-name}-AUDIT.md`
- Batch summary: `AUDIT-SUMMARY.md` (batch mode only)

## Format
Markdown report with summary table, per-component violations, NVC integration compliance, and prioritized remediation list.
</o>

<acceptance-criteria>
- [ ] Target skill path validated and entry point located
- [ ] Skill structure inventoried with folder-to-spec mapping
- [ ] Entry point assessed against entry-point.md spec
- [ ] Each present folder assessed against its corresponding spec
- [ ] NVC integration compliance checked (nvc-tools.md present and correct if skill uses NVC)
- [ ] Compliance scored per component (Compliant / Partial / Non-compliant)
- [ ] Violations recorded with specific details
- [ ] Report generated with summary table and remediation priorities
- [ ] User confirmed report location
</acceptance-criteria>
