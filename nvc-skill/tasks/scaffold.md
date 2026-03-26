<purpose>
Generate a compliant skill directory from a completed skill spec. Reads the structured output of /nvc:skill discover and creates all files — entry point, tasks, frameworks, templates, context, checklists — following syntax specs as authoring rules. If the spec includes NVC Integration, auto-generates frameworks/nvc-tools.md. Optionally manages the build via NeuralSkillsPack for larger skills.
</purpose>

<user-story>
As a skill builder, I want my skill spec automatically turned into a working directory with properly structured files, so that I can start customizing content immediately instead of manually creating boilerplate.
</user-story>

<when-to-use>
- After completing /nvc:skill discover and confirming the skill spec
- When you have a skill spec (pasted or in a file) and want to generate the directory
- Entry point routes here via /nvc:skill scaffold
</when-to-use>

<context>
@templates/skill-spec.md
</context>

<references>
@../specs/entry-point.md (when generating entry point)
@../specs/tasks.md (when generating task files)
@../specs/templates.md (when generating template files)
@../specs/frameworks.md (when generating framework files)
@../specs/context.md (when generating context files)
@../specs/checklists.md (when generating checklist files)
@rules/entry-point-rules.md (for validation)
@rules/tasks-rules.md (for validation)
@rules/templates-rules.md (for validation)
@rules/frameworks-rules.md (for validation)
@rules/context-rules.md (for validation)
@rules/checklists-rules.md (for validation)
</references>

<steps>

<step name="locate_spec" priority="first">
Get the skill spec to scaffold from.

1. Check if a skill spec was just produced by /nvc:skill discover in this session
   - If yes: "I have the spec from your discovery session. Use it?"
   - Wait for confirmation

2. If no recent spec, ask the user:
   - "Paste your skill spec below, or provide a file path to read it from."
   - Wait for input

3. Parse the spec and extract all sections:
   - **Identity**: name, type, version, category, description
   - **Persona**: role, style, expertise
   - **Activation**: what, when to use, not for
   - **Commands**: command table (if not task-only)
   - **Content Architecture**: tasks, frameworks, templates, context, checklists
   - **NVC Integration**: namespace, reads, writes, key conventions, session lifecycle (if present)

4. Validate parsed spec:
   - Name must be kebab-case
   - Type must be suite, standalone, or task-only
   - If NVC Integration present: namespace follows {domain}:{identifier} convention

5. Confirm: "Ready to scaffold `{name}` ({type}) with: {N} tasks, {N} frameworks, {N} templates, {N} context files, {N} checklists{, NVC integration}. Proceed?"

**Wait for confirmation before continuing.**
</step>

<step name="choose_location">
Determine where to create the skill directory.

Ask: "Where should I create this skill?"
- **Current directory** — Create `{skill-name}/` right here (default)
- **Custom path** — Specify a path
- **`apps/{name}/`** — Own git repo, shareable via GitHub

**Wait for response.**

<if condition="user chooses apps/">
1. Create `apps/{skill-name}/`
2. Run `git init -b main` in the new directory
</if>

<if condition="user chooses current directory or custom path">
1. Create `{skill-name}/` at the specified location
</if>
</step>

<step name="create_directory_structure">
Create the skill directory and subdirectories.

1. Create the root directory at the chosen location

2. Create subdirectories ONLY for folder types that have entries in the spec:
   - If tasks listed → create `tasks/`
   - If frameworks listed OR NVC Integration present → create `frameworks/`
   - If templates listed → create `templates/`
   - If context listed → create `context/`
   - If checklists listed → create `checklists/`

3. Do NOT create empty directories for folder types with no entries

4. Report: "Directory structure created: {skill-name}/ with {list of subdirectories}"
</step>

<step name="generate_entry_point">
Generate the skill entry point file following specs/entry-point.md.

Create `{skill-name}/{skill-name}.md` with:

**YAML Frontmatter:**
```yaml
---
name: {skill-name}
type: {skill-type}
version: 0.1.0
category: {category}
description: {description}
allowed-tools: [Read, Write, Glob, Grep, Edit, AskUserQuestion]
---
```

**XML Sections (all 5, in order):**

1. `<activation>` — Populate from spec's Activation section
2. `<persona>` — Populate from spec's Persona section
3. `<commands>` — Populate from spec's Commands table (omit for task-only)
4. `<routing>` — Derive from content architecture:
   - ## Always Load → context files
   - ## Load on Command → task files
   - ## Load on Demand → framework files
5. `<greeting>` — Compose from skill identity

**Keep it thin.** Entry point is identity + routing. No process logic.
</step>

<step name="generate_auxiliary_files">
Generate each file listed in the spec's content architecture.

**For each task file** (specs/tasks.md syntax):
Generate with all required XML sections: purpose, user-story, when-to-use, steps (with named steps), o, acceptance-criteria.
Every generated file must have meaningful scaffolded content — not empty shells.

**For each framework file** (specs/frameworks.md syntax):
- No frontmatter
- Purpose section
- Core Concepts with domain-relevant subsections
- Examples section
- Anti-Patterns section

**For each template file** (specs/templates.md syntax):
- Header: `# {Name} Template`
- Intro with output file naming pattern
- Fenced template block with {curly} and [square] placeholders
- Field Documentation table
- Section Specifications

**For each context file** (specs/context.md syntax):
- No frontmatter
- Standard sections based on context type
- Placeholder values: `[Not yet captured]`

**For each checklist file** (specs/checklists.md syntax):
- Header: `# {Name} Checklist`
- Purpose line
- Categorized `- [ ]` items

**If spec includes NVC Integration — auto-generate `frameworks/nvc-tools.md`:**

```markdown
# NVC Tools Reference

## Purpose
NeuralVaultCore MCP tool signatures and conventions for this skill.
Reference this framework when implementing NVC read/write operations.

## MCP Tools

### store_memory
store_memory(key, content, tags, title, namespace)
- key: string, format {namespace}:{type}
- content: string, max 1MB
- tags: comma-separated string
- title: short descriptive string
- namespace: string, format {domain}:{identifier}
Returns: "stored | {key} | {namespace} | {chars} chars"

### retrieve_memory
retrieve_memory(key, namespace, view, max_chars)
- view: "head" | "tail" | "head_tail" | "full" (default: head_tail)
- max_chars: int (default: 2000)
Returns: content or "not_found | {key} | ns:{namespace}"

### search_memories
search_memories(query, namespace, keys_only, limit)
- keys_only: bool (default: True) — use True for directory scan
- limit: int (default: 10)
Returns: list of matching memory keys/titles

### list_all_memories
list_all_memories(namespace, limit, offset, keys_only)
- Use for browsing, not for session start (use get_context instead)

### get_context
get_context(namespace, limit, keys_only)
- Use at session start — returns _state + recent memories
- limit: int (default: 10)
- keys_only: bool (default: True)

### delete_memory
delete_memory(key, namespace)

### get_versions
get_versions(key, namespace)

### restore_version
restore_version(key, namespace, version)

### get_stats
get_stats(verbose)

## Namespace Convention
{namespace-pattern from spec}

## Key Conventions
{key conventions from spec}

## Token Efficiency Rules
- Use get_context() at session start, never list_all_memories
- Use keys_only=True when scanning what exists
- Use view="head_tail" for preview before full read
- Use search_memories before retrieve_memory for discovery

## Never Store
- .env content, API keys, tokens, passwords
- Raw stack traces or full error logs
- Binary data or base64 content
```
</step>

<step name="neuralskillspack_integration">
For skills with 10+ total files, offer NeuralSkillsPack-managed build.

1. Count total files to create (entry point + all auxiliary files)
2. If fewer than 10: skip this step, continue to validate_and_report

3. If 10+ files, ask:
   "This skill has {N} files to create. Want to manage the build with NeuralSkillsPack (/nvc:plan + /nvc:execute)?"
   - **Yes** — phased, NVC-backed managed build
   - **No** — generate all files now in this session

4. If **No**: continue to validate_and_report

5. If **Yes**:
   a. Check if NVC MCP is connected (try get_stats())
   b. If NVC not connected: "NVC MCP not connected — generating all files now instead."
      Continue to validate_and_report.
   c. If NVC connected:
      - store_memory(
          key="{skill-name}:build-plan",
          namespace="nvc-skill-builder",
          content={phased build plan with all files listed},
          tags="plan,active,scaffold"
        )
      - Propose phase structure:
        - Phase 1: Entry point + directory structure
        - Phase 2: Task files
        - Phase 3: Frameworks + templates
        - Phase 4: Context + checklists
        - Phase 5: Validation + install test
      - Report: "Build plan saved to NVC. Run /nvc:execute to start phase by phase."
      - *(Stored to NVC)*
      - **STOP HERE** — NeuralSkillsPack manages the rest
</step>

<step name="validate_and_report">
Validate generated files and report results.

1. Load each rules file from `rules/` directory
2. For each generated file, check against its corresponding rule
3. Report results:
   ```
   Scaffold Complete: {skill-name}

   Files created:
   - {skill-name}/{skill-name}.md (entry point)
   - {skill-name}/tasks/{file}.md
   - {skill-name}/frameworks/{file}.md
   - {skill-name}/frameworks/nvc-tools.md (if NVC integration)
   - ...

   Validation: {N}/{N} files pass rules

   Next steps:
   1. Review each file and customize for your domain
   2. Replace placeholder content with real domain knowledge
   3. Test by running /{skill-name}
   ```

4. If any validation issues found, list them with fix suggestions.
</step>

</steps>

<o>
## Artifact
Complete skill directory with all files scaffolded from the skill spec.

## Structure
```
{skill-name}/
├── {skill-name}.md          (entry point)
├── tasks/
│   └── {task-name}.md
├── frameworks/
│   ├── {framework-name}.md
│   └── nvc-tools.md         (if NVC integration)
├── templates/
│   └── {template-name}.md
├── context/
│   └── {context-name}.md
└── checklists/
    └── {checklist-name}.md
```
</o>

<acceptance-criteria>
- [ ] Skill spec successfully parsed with all sections extracted
- [ ] User chose location and directory created
- [ ] Directory structure created with only populated folder types
- [ ] Entry point has correct YAML frontmatter and all 5 XML sections
- [ ] All auxiliary files follow their respective syntax specs
- [ ] If NVC Integration in spec: frameworks/nvc-tools.md generated with correct tool signatures
- [ ] Generated files contain meaningful scaffolded content (not empty placeholders)
- [ ] If 10+ files: user offered NeuralSkillsPack-managed build option
- [ ] If NeuralSkillsPack chosen: build plan saved to NVC, phases proposed
- [ ] If non-NeuralSkillsPack path: validation report shows all files pass rules
- [ ] User informed of results and next steps
</acceptance-criteria>
