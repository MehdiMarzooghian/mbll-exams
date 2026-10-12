import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
const elements = new Map();
let options = [];
function element(id) {
  if (!elements.has(id)) {
    const classes = new Set();
    elements.set(id, {textContent:'',innerHTML:'',value:'',hidden:false,disabled:false,
      listeners:{},dataset:{},style:{setProperty(){}},
      classList:{add(c){classes.add(c);},remove(c){classes.delete(c);},toggle(c,on){on ? classes.add(c) : classes.delete(c);},contains(c){return classes.has(c);}},
      addEventListener(type,callback){this.listeners[type]=callback;},focus(){},
      setAttribute(){},removeAttribute(){},toggleAttribute(){},querySelectorAll(){return [];} });
  }
  return elements.get(id);
}
const store = new Map();
const ctx = vm.createContext({window:{scrollTo(){}},console,setTimeout(){},clearTimeout(){},
  localStorage:{getItem:key=>store.get(key) ?? null,setItem:(key,value)=>store.set(key,value)},
  document:{getElementById:element,querySelector:element,querySelectorAll(selector){return selector === '[data-option]' ? options : [];}}});
for (const file of ['mbll-question-banks.js','ap-photo-lessons.js','maeita-question-bank.js','exam-banks.js']) vm.runInContext(fs.readFileSync(new URL(file,root),'utf8'),ctx);
const app = fs.readFileSync(new URL('app.js',root),'utf8');
vm.runInContext(app.slice(0,app.indexOf("  document.addEventListener('click'")) + 'window.test={selectCollection,startExam,renderQuestion,advanceExam,getExam:()=>activeExam,getState:()=>state};})();',ctx);
const api = ctx.window.test, banks = ctx.window.MBLL_BANKS;
for (const id of ['microbiologyLab','lectureExam1','lectureExam2']) {
  assert.equal(banks[id].examMode,'comprehensive');
  const children = Object.values(banks).filter(bank=>bank.parentId===id && bank.courseParent);
  assert.equal(children.flatMap(bank=>bank.questions).length,banks[id].questions.length);
  assert.ok(children.every(bank=>bank.questions.length));
}
const first = banks.lectureExam1.questions[0];
const key = 'mbll-exams-v2-lectureExam1';
store.set(key,JSON.stringify({version:3,history:[{id:'previous',level:'easy',score:50}],mistakes:[],completed:{easy:true,medium:true,hard:true},drafts:{easy:{questionIds:[first.id],responses:{[first.id]:first.answer},index:0,startedAt:'2026-10-01'}}}));
api.selectCollection('lectureExam1');
assert.equal(api.getState().completed.comprehensive,true);
assert.equal(api.getState().history[0].id,'previous');
assert.equal(api.getState().drafts.comprehensive.responses[first.id],first.answer);
api.startExam('comprehensive');
assert.equal(api.getExam().questions.length,155);
// Complete a tiny fixture through the actual selection, persistence, grading and unlock flow.
banks.fixture = {...banks.microbiologyLab,id:'fixture',courseParent:'fixture',questions:[
  {...first,id:'mc',options:['correct','wrong'],answer:'correct'},
  {id:'short',type:'short',level:'comprehensive',prompt:'Name it',topic:'Lab',answers:['term'],displayAnswer:'term',explanation:'Term explanation'}]};
api.selectCollection('fixture');
options = ['correct','wrong'].map(value=>{const button=element(value);button.dataset.option=value;return button;});
api.startExam('comprehensive');
options[1].listeners.click();
assert.ok(options[0].classList.contains('answer-correct'));
assert.ok(options[1].classList.contains('answer-wrong'));
options[0].listeners.click();
assert.equal(api.getExam().responses.mc,'wrong','first answer cannot be changed after feedback');
api.advanceExam();
assert.equal(element('next-question').disabled,true);
element('short-answer').value='term';element('short-answer').listeners.input();
element('check-answer').listeners.click();
assert.ok(element('short-answer').classList.contains('answer-correct'));
api.advanceExam();
assert.equal(api.getState().history[0].score,50);
assert.equal(api.getState().mistakes[0].questionId,'mc');
assert.equal(api.getState().completed.comprehensive,true);
api.startExam('review');
assert.equal(api.getExam().questions.length,1);
assert.equal(api.getExam().questions[0].id,'mc');
console.log('PASS: comprehensive pools, every unit, legacy progress, immediate feedback, first-answer locking, short answers, final grading and mistake review.');
