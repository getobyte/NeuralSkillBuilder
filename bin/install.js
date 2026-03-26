#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const args = process.argv.slice(2);
const isLocal = args.includes('--local');
const isGlobal = args.includes('--global') || !isLocal;
const customConfigDir = (() => {
  const idx = args.indexOf('--config-dir');
  return idx !== -1 ? args[idx + 1] : null;
})();
const sourceDir = path.join(__dirname, '..', 'nvc-skill');
const specsSource = path.join(__dirname, '..', 'specs');
let claudeDir;
if (customConfigDir) {
  claudeDir = customConfigDir;
} else if (isLocal) {
  claudeDir = path.join(process.cwd(), '.claude');
} else {
  claudeDir = path.join(os.homedir(), '.claude');
}
const commandsDir = path.join(claudeDir, 'commands', 'nvc');
const specsDir = path.join(claudeDir, 'nvc-skill-specs');
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
console.log('Installing NeuralSkillBuilder...');
console.log(`Location: ${isLocal ? 'local (.claude/)' : 'global (~/.claude/)'}`);
console.log('');
try {
  copyRecursive(sourceDir, commandsDir);
  copyRecursive(specsSource, specsDir);
  console.log(`Skill installed to: ${commandsDir}`);
  console.log(`Specs installed to: ${specsDir}`);
  console.log('');
  console.log('NeuralSkillBuilder installed successfully.');
  console.log('Open Claude Code and type /nvc:skill to start.');
  console.log('');
  console.log('Commands:');
  console.log('  /nvc:skill discover  — Design a new skill');
  console.log('  /nvc:skill scaffold  — Generate skill directory from spec');
  console.log('  /nvc:skill distill   — Chunk source material into frameworks');
  console.log('  /nvc:skill audit     — Check skill compliance');
} catch (err) {
  console.error('Installation failed:', err.message);
  process.exit(1);
}
