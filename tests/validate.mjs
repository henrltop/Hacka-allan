import {readFile} from 'node:fs/promises';
const html=await readFile('index.html','utf8');
const js=await readFile('app.js','utf8');
const data=JSON.parse(await readFile('data/mock-data.json','utf8'));
const agenda=JSON.parse(await readFile('data/agenda.json','utf8'));
const required=['hoje','latestNews','agenda','agendaNext','agendaList','agendaTypeFilter','agendaHideDone','observatorio','buscador','copiloto','auditor','trajetoria','conteudo','periodFilter','topicFilter','sourceFilter'];
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
if(!js.includes('auditClaim')||!js.includes('generateBriefing')||!js.includes('renderAgenda')) throw new Error('Módulos funcionais ausentes');
console.log(`Validação concluída: ${data.items.length} registros, ${agenda.events.length} compromissos de agenda, ${required.length} componentes e WhatsApp desativado.`);
