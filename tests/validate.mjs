import {readFile} from 'node:fs/promises';
const html=await readFile('index.html','utf8');
const data=JSON.parse(await readFile('data/mock-data.json','utf8'));
const required=['monitoramento','copiloto','periodFilter','topicFilter','sourceFilter'];
for(const id of required) if(!html.includes(`id="${id}"`)) throw new Error(`Elemento ausente: ${id}`);
if(!Array.isArray(data.items)||data.items.length<10) throw new Error('Base mockada insuficiente');
for(const item of data.items) for(const key of ['date','source','topic','summary','facts']) if(!item[key]) throw new Error(`Campo ${key} ausente no item ${item.id}`);
console.log(`Validação concluída: ${data.items.length} itens e ${required.length} componentes essenciais.`);
