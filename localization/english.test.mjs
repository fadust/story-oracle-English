import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { englishOutputMessages, ENGLISH_OUTPUT_RULE } from './english.mjs';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = fs.readFileSync(new URL('../index.js', import.meta.url), 'utf8');
const ast = ts.createSourceFile('index.js', source, ts.ScriptTarget.Latest, true);
const names = new Set(['SEQ_PULSE_LINE_RE', 'SEQ_PULSE_QUOTE_OPEN', 'SEQ_PULSE_QUOTE_CLOSE', 'CHIP_BLOCK_HEADER', 'FORGE_ASSEMBLY_ORDER', 'BUILDER_FORGE_PROMPT']);
const declarations = [];
for (const node of ast.statements) {
  if (ts.isFunctionDeclaration(node)) declarations.push(node.getText(ast));
  if (ts.isVariableStatement(node)) for (const declaration of node.declarationList.declarations) {
    const name = declaration.name.getText(ast);
    if (names.has(name)) declarations.push(`const ${declaration.getText(ast)};`);
  }
}
const context = vm.createContext({ console, englishOutputMessages });
vm.runInContext(declarations.join('\n'), context);
const run = (code, input) => { context.input = input; return vm.runInContext(code, context); };

const turns = [{ role: 'user', content: 'Rowan O’Connor asks about the old map.\n\nKeep this paragraph exactly.' }, { role: 'assistant', content: 'Alexandra Montgomery-Smythe knows the harbor is closed.' }];
const exported = run('buildConvoExportMd(input, {modeLabel:"Chat", chatName:"Long English Names", when:"2026-10-13"})', turns);
const parsed = run('parseConvoExportMd(input)', exported);
assert.deepEqual(JSON.parse(JSON.stringify(parsed.turns)), turns);
assert.equal(parsed.meta.modeLabel, 'Chat');
assert.equal(parsed.meta.count, 2);
assert.equal(run('parseConvoExportMd(input).turns[0].role', '**【我】**\n\n旧存档原文'), 'user');
assert.equal(run('fixFwdHardStructural(input)', 'Alexandra Montgomery-Smythe carefully examines the inscription without opening the door.'), false);
assert.equal(run('fixFwdHardStructural(input)', '<UpdateVariable>'), true);
assert.equal(run('condenseNarrStats(input).sents', 'She checks the map. Rowan waits nearby. They leave the door locked.'), 3);
const pulse = run('parseSeqPulseLine(input)', '<so_seq>拍=2 码=AB12 状态=已达成 证据=「Rowan unlocked the door.」</so_seq>');
assert.equal(pulse.status, '已达成');
assert.equal(pulse.quote, 'Rowan unlocked the door.');
const ops = run('parseCondenseOps(input).ops', '〔删〕old phrase\n〔缩〕long phrase → phrase\n〔过〕');
assert.equal(ops.length, 3);
assert.equal(ops[1].kind, '缩');
const messages = [{ role: 'user', content: '请分析剧情。Keep the name 小雪 unchanged.' }];
const outgoing = englishOutputMessages(messages);
assert.ok(outgoing[0].content.includes(ENGLISH_OUTPUT_RULE));
assert.equal(outgoing[1].content, messages[0].content);
assert.equal(messages.length, 1);
assert.equal(englishOutputMessages(outgoing), outgoing);
const gated = run('gateForgePrompt(BUILDER_FORGE_PROMPT, input)', ['basics', 'appearance']);
assert.ok(gated.includes('■ Basic Information：'));
assert.ok(gated.includes('■ Appearance：'));
assert.ok(!gated.includes('■ Background：'));
assert.ok(gated.includes('Step 5:'));
assert.ok(gated.includes('Basic Information→Appearance'));
const evidence = '⟨She always wears this ring.⟩ (Evidence: Rowan never opened the door.)';
assert.equal(run('sanitizePersonaDraft(input, "nosteal")', evidence), evidence);
assert.equal(run('sanitizePersonaDraft(input, "nosteal")', 'She always waits and is extremely careful.'), 'She usually waits and is very careful.');
console.log('Story Oracle: English export round-trip, legacy imports, English prose protection, sentence analysis, pulse markers, condensing operations, and output-language rules passed.');
