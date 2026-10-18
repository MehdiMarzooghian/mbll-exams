import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('../',import.meta.url);
const ctx=vm.createContext({window:{}});
for (const name of ['mbll-question-banks.js','maeita-question-bank.js','ap-photo-lessons.js','exam-banks.js']) vm.runInContext(fs.readFileSync(new URL(name,root),'utf8'),ctx);
const retired=JSON.parse(fs.readFileSync(new URL('coverage/retired-questions.json',root),'utf8'));
const ledger=JSON.parse(fs.readFileSync(new URL('coverage/reviewed-banks.json',root),'utf8'));
const banks=ctx.window.MBLL_BANKS;
const generic=/which statement is accurate|in the context of|which statement correctly/i;
for (const id of ['microbiologyLab','lectureExam1','lectureExam2']) {
  const bank=banks[id], seen=new Set(), retiredIds=new Set(retired.banks[id].map(q=>q.id));
  const positions=[0,0,0,0];
  for (const q of bank.questions) {
    assert.ok(!generic.test(q.prompt),q.id);
    assert.ok(!retiredIds.has(q.id),`Retired ID ${q.id} must never be reassigned`);
    assert.ok(!seen.has(q.prompt),`Duplicate prompt: ${q.prompt}`); seen.add(q.prompt);
    assert.ok(q.source && q.explanation,q.id);
    if (q.type==='mcq') {
      assert.equal(new Set(q.options).size,4,q.id);
      assert.equal(q.options.filter(option=>option===q.answer).length,1,q.id);
      assert.ok(q.prompt.endsWith('?'),q.id);
      positions[q.options.indexOf(q.answer)]++;
    }
  }
  assert.ok(positions.every(n=>n>0));
  const unitIds=Object.values(banks).filter(b=>b.courseParent===id && b.parentId===id).flatMap(b=>b.questions.map(q=>q.id));
  assert.equal(new Set(unitIds).size,bank.questions.length);
  console.log(id,bank.questions.length,'questions; answer positions',positions);
}
for (const unit of ledger.units) {
  assert.notEqual(unit.status,'needs-explicit-link',`${unit.source} ${unit.unit}`);
  for (const id of unit.questionIds) assert.ok(banks[unit.bank].questions.some(q=>q.id===id));
}
assert.ok(banks.microbiologyLab.questions.some(q=>q.prompt.includes('colorless after reagents A and B and then zinc')));
console.log('PASS: no generic active stems, no retired ID reuse, unique answers, unit partitions, and source links.');
