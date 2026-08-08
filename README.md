# AKAssistente

Painel interno da equipe (antes "Observatório + Copiloto"): monitoramento agregado de informações públicas, agenda do deputado e preparação factual. MVP estático em HTML/CSS/JS puro, com shell de views (sidebar + uma view por seção, redesign "Semana da Equipe"/estilo 2c). O sistema **não faz microdirecionamento, perfilamento individual ou otimização de persuasão**.

## ⚠️ Acesso e privacidade

Este é um sistema **interno** da equipe, mas o repositório está público e o GitHub Pages publica o site aberto na internet. A seção **Agenda** contém deslocamentos futuros do deputado — informação sensível de segurança pessoal que não deve ficar exposta publicamente. Antes de fazer push da agenda:

1. torne o repositório **privado** (Settings → General → Danger Zone → Change visibility);
2. lembre que GitHub Pages de repositório privado continua **público** no plano gratuito — para acesso restrito da equipe, use uma hospedagem com autenticação (ex.: Cloudflare Access/Zero Trust, Vercel com proteção por senha) ou rode localmente;
3. alternativa provisória: manter `data/agenda.json` fora do repositório remoto e distribuí-lo apenas internamente.

## O que já funciona

- tela inicial **Semana da Equipe**: grade de 7 dias derivada da agenda (hoje, compromissos, janelas de produção), pendências da equipe, itens "não usar em público", próximo compromisso e recentes na base;
- Agenda completa com os 17 compromissos do planejamento (agosto a outubro), status automático pela data (realizado, hoje, em andamento, contagem regressiva), filtro por tipo, resumo e atalho de briefing por compromisso;
- Observatório com temas, fontes, nível de evidência e linha do tempo;
- Buscador de pautas por texto, período, tema, fonte e situação da evidência;
- Copiloto local com perguntas difíceis, críticas, fatos, exemplos e alertas;
- Auditor local para triagem inicial de afirmações, números e promessas;
- trajetória documentada do Allan e quadro editorial;
- 12 registros públicos reais, com links e classificação metodológica;
- WhatsApp fora do escopo desta versão;
- nenhuma chave, API externa ou segredo no front-end.

## Rodar localmente

Como o navegador carrega um arquivo JSON, use um servidor estático simples (abrir o HTML diretamente pode bloquear a leitura do JSON):

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub e envie estes arquivos para a branch `main`.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **GitHub Actions**.
4. A action incluída em `.github/workflows/pages.yml` fará a publicação automaticamente.

O site usa caminhos relativos e funciona tanto em domínio próprio quanto em `usuario.github.io/nome-do-repositorio/`.

## Dados e arquitetura

O front-end lê somente `data/mock-data.json`, `data/agenda.json` e `data/tarefas.json` (pendências da equipe, itens "não usar em público" e plano de produção da semana). O formato atual já separa campos úteis para ingestão futura: data, fonte, tipo de fonte, tema, sentimento agregado, volume, resumo, perguntas, fatos, crítica e exemplo.

### Agenda (`data/agenda.json`)

Cada compromisso tem `id`, `ref` (número na tabela original do planejamento), `start`/`end` (ISO `AAAA-MM-DD`, iguais para evento de um dia), `time` (`"19h"`, `"19h30"` ou `null`), `type` (`reuniao`, `viagem`, `evento`, `encerramento`), `title` e `locations` (lista de municípios/regiões). Para atualizar a agenda, edite o JSON, rode `npm test` e faça commit — o status (realizado/hoje/em X dias) é calculado no navegador, sem necessidade de mexer no código.

Fluxo preparado:

```text
RSS / APIs públicas / portais
          ↓
GitHub Actions (coleta, normalização e deduplicação)
          ↓
data/items.json versionado ou storage externo
          ↓
Dashboard estático
          ↓
Backend serverless + RAG (fase futura)
```

Para coleta automática, uma Action futura pode executar scripts agendados e atualizar o JSON. Respeite termos de uso, robots.txt, limites de requisição, direitos autorais e legislação eleitoral aplicável.

## Adapter futuro de IA

O demo gera o briefing com lógica determinística local. Em produção, substitua a função `generateBriefing()` por um adapter que chame **um backend serverless**, nunca o provedor de IA diretamente do navegador. O backend deve guardar a chave, buscar trechos na base, incluir fontes e devolver respostas com evidência.

Interface sugerida:

```js
async function createBriefing({ filters, items }) {
  // Demo: processamento local.
  // Futuro: POST para /api/briefing, autenticado e com rate limit.
}
```

## Plano de evolução

### Fase 1 — MVP estático

- validar navegação, filtros, categorias e formato do briefing;
- substituir mocks por amostra pública revisada manualmente;
- definir metodologia de classificação e política de correção.

### Fase 2 — Ingestão automática

- coletores agendados via GitHub Actions para RSS e APIs públicas;
- normalização, deduplicação, logs e fila de revisão humana;
- registro de URL, horário de coleta, licença e nível de confiança;
- migrar para storage/backend se o volume superar o limite prático do repositório.

### Fase 3 — Copiloto com RAG/backend

- API serverless com segredos protegidos e controle de acesso;
- busca semântica apenas na base autorizada, com citações;
- respostas com nível de confiança, recusa quando faltar evidência e trilha de auditoria;
- avaliação humana recorrente de factualidade, viés e segurança.

## Limites do MVP

Sentimento é apenas demonstrativo e agregado. Menções públicas não equivalem a pesquisa de opinião. Todo número relevante deve ser confirmado em fonte primária antes do uso público.
