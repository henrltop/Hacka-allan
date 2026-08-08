import {readFile} from 'node:fs/promises';
const html=await readFile('index.html','utf8');
const js=await readFile('app.js','utf8');
const data=JSON.parse(await readFile('data/mock-data.json','utf8'));
const agenda=JSON.parse(await readFile('data/agenda.json','utf8'));
const tarefas=JSON.parse(await readFile('data/tarefas.json','utf8'));
if(!html.includes('<title>AKAssistente</title>')) throw new Error('Título AKAssistente ausente');
const required=['sidebar','menuBtn','semana','weekTitle','weekGrid','pendList','vetoList','weekNextEv','freshList','agenda','agendaList','agendaTypeFilter','agendaHideDone','agTotal','observatorio','recordCount','evidencePct','timelineChart','topicsChart','buscador','searchInput','periodFilter','topicFilter','sourceFilter','evidenceFilter','itemsList','copiloto','recorteCount','generateBriefing','briefingCard','auditor','claimInput','auditButton','auditResult','trajetoria','conteudo'];
for(const id of required) if(!html.includes(`id="${id}"`)) throw new Error(`Elemento ausente: ${id}`);
if(/whatsapp/i.test(html)) throw new Error('WhatsApp deve permanecer fora deste MVP');
if(!Array.isArray(data.items)||data.items.length<10) throw new Error('Base pública insuficiente');
for(const item of data.items) for(const key of ['date','source','topic','summary','facts','url','verificationStatus']) if(!item[key]) throw new Error(`Campo ${key} ausente no item ${item.id}`);
if(!Array.isArray(agenda.events)||agenda.events.length<17) throw new Error('Agenda incompleta: o planejamento atual tem 17 compromissos');
const agendaTypes=new Set(['reuniao','viagem','evento','encerramento']);
for(const ev of agenda.events){
  for(const key of ['id','ref','start','end','title','type','locations']) if(!(key in ev)) throw new Error(`Campo ${key} ausente no compromisso ${ev.id??'?'}`);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(ev.start)||!/^\d{4}-\d{2}-\d{2}$/.test(ev.end)) throw new Error(`Data inválida no compromisso ${ev.id}`);
  if(ev.start>ev.end) throw new Error(`Período invertido no compromisso ${ev.id}`);
  if(!agendaTypes.has(ev.type)) throw new Error(`Tipo desconhecido no compromisso ${ev.id}`);
  if(!Array.isArray(ev.locations)||!ev.locations.length) throw new Error(`Locais ausentes no compromisso ${ev.id}`);
}
if(!Array.isArray(tarefas.pendencias)||!tarefas.pendencias.length) throw new Error('tarefas.json sem pendências');
for(const p of tarefas.pendencias) for(const key of ['texto','resp']) if(!p[key]) throw new Error(`Campo ${key} ausente na pendência ${p.id??'?'}`);
if(!Array.isArray(tarefas.naoUsar)) throw new Error('tarefas.json sem lista naoUsar');
for(const v of tarefas.naoUsar) for(const key of ['status','titulo','motivo']) if(!v[key]) throw new Error(`Campo ${key} ausente no veto ${v.id??'?'}`);
for(const fn of ['auditClaim','generateBriefing','renderAgenda','showView','renderWeek','renderTarefas']) if(!js.includes(fn)) throw new Error(`Módulo funcional ausente: ${fn}`);
console.log(`Validação concluída: ${data.items.length} registros, ${agenda.events.length} compromissos, ${tarefas.pendencias.length} pendências, ${required.length} componentes e WhatsApp desativado.`);
