import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root = new URL('../', import.meta.url);
const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, {
    textContent:'', innerHTML:'', hidden:true, value:'',
    style:{setProperty(){}}, classList:{add(){},remove(){},toggle(){}},
    setAttribute(){},removeAttribute(){},toggleAttribute(){},addEventListener(){},focus(){},
    querySelectorAll(){return [];}
  });
  return elements.get(id);
}
const stored = new Map();
let blockStorage = false;
const context = vm.createContext({
  window:{scrollTo(){}},
  document:{getElementById:element,querySelector:element,querySelectorAll(){return [];}},
  localStorage:{getItem:key=>stored.get(key) ?? null,setItem(key,value){
    if (blockStorage) throw new Error('QuotaExceededError');
    stored.set(key,value);
  }},setTimeout(){},clearTimeout(){},console
});
for (const name of ['mbll-question-banks.js','ap-photo-lessons.js','exam-banks.js']) {
  vm.runInContext(fs.readFileSync(new URL(name,root),'utf8'),context);
}
// Exercise real application functions without installing event handlers in a simulated DOM.
const app = fs.readFileSync(new URL('app.js',root),'utf8');
vm.runInContext(app.slice(0,app.indexOf("  document.addEventListener('click'")) +
  'window.test = {selectCollection,startExam,persistDraft,getExam:()=>activeExam,getState:()=>state};})();',context);
const api = context.window.test;
for (const id of ['apEndocrine','apBlood','apHeart','apDissection','apVessels','apPhysiology']) {
  for (const level of ['easy','medium','hard']) {
    api.selectCollection(id);
    api.startExam(level);
    assert.ok(api.getExam().questions.length, `${id}/${level} must open`);
    assert.ok(element('question-card').innerHTML.includes('short-answer'));
    assert.ok(element('question-card').innerHTML.includes('<svg'));
  }
}
const key = 'mbll-exams-v2-apPhysiology';
const fixture = {version:3,history:[{id:'old',level:'easy',score:50}],mistakes:[],
  completed:{easy:true},drafts:{easy:{questionIds:['obsolete-id'],index:-10,responses:{}}}};
api.selectCollection('apBlood');
stored.set(key,JSON.stringify(fixture));
api.selectCollection('apPhysiology'); api.startExam('easy');
assert.equal(api.getExam().index,0);
assert.equal(api.getExam().questions.length,5);
assert.equal(api.getState().history[0].id,'old');
const saved = JSON.parse(stored.get(key));
saved.drafts.easy.index = -4;
api.selectCollection('apBlood');
stored.set(key,JSON.stringify(saved));
api.selectCollection('apPhysiology'); api.startExam('easy');
assert.equal(api.getExam().index,0);
const valid = JSON.parse(stored.get(key));
valid.drafts.easy.index = 2;
valid.drafts.easy.responses[valid.drafts.easy.questionIds[0]] = 'existing response';
api.selectCollection('apBlood');
stored.set(key,JSON.stringify(valid));
api.selectCollection('apPhysiology'); api.startExam('easy');
assert.equal(api.getExam().index,2);
assert.equal(api.getExam().responses[valid.drafts.easy.questionIds[0]],'existing response');
blockStorage = true;
assert.doesNotThrow(()=>{api.selectCollection('apPhysiology');api.startExam('hard');});
assert.equal(api.getExam().questions.length,6);
assert.equal(element('view-exam').hidden,false);
assert.match(element('.data-pill').textContent,/not saved/);
assert.equal(api.getState().history[0].id,'old');
console.log('PASS: 18 lesson/level starts, stale draft recovery, valid resume, preserved history, and blocked storage.');
