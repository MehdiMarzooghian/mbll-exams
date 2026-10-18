"""Compile authored, source-located questions; never turn extracted sentences into options."""
import collections
import hashlib
import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCES = json.loads((ROOT.parent / 'mbll-extraction/sources.json').read_text(encoding='utf-8'))

def read_assignment(path):
    return json.loads(path.read_text(encoding='utf-8').split(' = ', 1)[1].rstrip(';\n'))

def compile_rows(name, field, prefix):
    result = []
    counters = collections.Counter()
    for line in (ROOT / 'authoring' / name).read_text(encoding='utf-8').splitlines():
        if not line.strip() or line.startswith('#'): continue
        parts = line.split('|')
        assert len(parts) == 9, line
        number, refs, topic, prompt, answer, a, b, c, explanation = parts
        number = int(number)
        refs = [int(n) for n in refs.split(',')]
        assert prompt.endswith('?') and len({answer,a,b,c}) == 4, line
        assert explanation != answer + '.', line
        counters[number] += 1
        qid = f'{prefix}-{number}-{counters[number]:03d}'
        record = next(record for record in SOURCES if
            record.get('source','').startswith(f'Chapter_{number}_' if field == 'chapter' else f'LM+{number:02d}+'))
        unit_key = 'slides' if field == 'chapter' else 'pages'
        assert all(1 <= n <= len(record[unit_key]) for n in refs), line
        result.append(dict(id=qid,level='comprehensive',type='mcq',**{field:number},topic=topic,
            unit=f'{unit_key}-{refs[0]}',**{unit_key:refs},
            source=f'{record["source"]} · {unit_key} '+', '.join(map(str,refs)),
            prompt=prompt,answer=answer,options=[answer,a,b,c],explanation=explanation))
    result.sort(key=lambda q:(q[field],q.get('slides',q.get('pages'))[0]))
    rng = random.Random(20261018)
    positions = [n % 4 for n in range(len(result))]; rng.shuffle(positions)
    for question, position in zip(result,positions):
        wrong = question['options'][1:]; rng.shuffle(wrong)
        wrong.insert(position,question['answer']); question['options'] = wrong
    return result

path = ROOT / 'mbll-question-banks.js'
original = read_assignment(path)
archive = ROOT / 'coverage/retired-questions.json'
if not archive.exists():
    retired = {key:[q for q in original[key] if q['type']=='mcq'] for key in ['microbiologyLab','lectureExam1','lectureExam2']}
    archive.write_text(json.dumps(dict(reason='Retired: generic stems and extracted fragment options. Historical IDs are not reassigned.',banks=retired),ensure_ascii=False,indent=2),encoding='utf-8')
custom = read_assignment(ROOT / 'maeita-question-bank.js')
original['microbiologyLab'] = compile_rows('lab.tsv','module','reviewed-lab') + [q for q in original['microbiologyLab'] if q['type']=='short']
original['lectureExam1'] = custom['questions']
original['lectureExam2'] = compile_rows('lecture2.tsv','chapter','reviewed-lecture')
path.write_text('window.MBLL_QUESTION_BANKS = '+json.dumps(original,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
ledger=[]
for record in SOURCES:
    if record.get('kind') not in ['lecture','lab']: continue
    lecture = record['kind']=='lecture'
    number = int(re.search(r'Chapter_(\d+)_|LM\+(\d+)\+',record['source']).group(1 if lecture else 2))
    bank = 'lectureExam1' if lecture and number < 13 else 'lectureExam2' if lecture else 'microbiologyLab'
    for unit in record['slides' if lecture else 'pages']:
        n = unit['slide' if lecture else 'page']
        direct = [q['id'] for q in original[bank] if q.get('chapter' if lecture else 'module')==number and n in q.get('slides' if lecture else 'pages',[])]
        title = unit.get('text','').split('\n')[0][:120]
        administrative = lecture and (n in [1,2,len(record['slides'])] or 'Questions for Review' in title)
        ledger.append(dict(bank=bank,source=record['source'],number=number,unit=n,title=title,
            status='linked' if direct else 'objectives-or-review' if administrative else 'needs-explicit-link',questionIds=direct))
(ROOT/'coverage/reviewed-banks.json').write_text(json.dumps(dict(revision='2026-10-18',method='Human-authored stems, three related distractors, a distinct explanation, and explicit page/slide references. Linked status is traceability, not a guarantee that every sentence is tested.',units=ledger),ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({key:len(value) for key,value in original.items()}))
print('Unlinked source units:',[(u['number'],u['unit'],u['title']) for u in ledger if u['status']=='needs-explicit-link'])
