# DevFinance — Projeto Prático de React

## O que é

Um app de finanças pessoais construído em React puro (Vite + TypeScript), sem backend.
Os dados vêm de uma API fake (json-server ou dados em memória).
O foco é 100% React: hooks, estado, componentização, modais.

Inspirado no mundo que você vai construir no Laravel depois — mas aqui é só frontend, sem muleta de framework.

---

## Stack

- **Vite** com template `react-ts`
- **shadcn/ui** (instale com o CLI deles)
- **Tailwind CSS** (vem junto com shadcn)
- **Lucide React** (ícones — já vem com shadcn)
- **json-server** para API fake (ou array em memória se preferir começar mais simples)

### Setup inicial
```bash
npm create vite@latest devfinance -- --template react-ts
cd devfinance
# instale shadcn seguindo a doc oficial
# instale json-server: npm install -D json-server
```

### Sem instalar mais nada
Nada de TanStack Query, nada de TanStack Router, nada de React Router, nada de Zustand, nada de Redux. Você vai usar **fetch nativo** e **useState/useEffect** para tudo. Quando sentir a dor de não ter essas libs, vai entender por que elas existem — e esse é o ponto.

---

## As 4 telas do app

### Tela 1 — Dashboard (página principal)
O que mostra:
- 3 cards de resumo no topo: Receitas (total), Despesas (total), Saldo
- Lista/tabela das últimas transações
- Input de busca com debounce (filtra a tabela conforme digita)
- Botão "+ Nova" que abre modal de criação

### Tela 2 — Transações (CRUD completo)
O que mostra:
- Tabela com todas as transações (descrição, categoria, valor, data, conta)
- Filtro por busca com debounce
- Filtro por tipo (Receita / Despesa / Todos) com botões toggle
- Filtro por categoria (select)
- Botão "+ Nova transação" → abre modal de criação
- Em cada linha: botão Editar → abre modal de edição com dados preenchidos
- Em cada linha: botão Excluir → abre modal de confirmação

### Tela 3 — Categorias (CRUD simples)
O que mostra:
- Lista de categorias (nome + cor + ícone)
- Botão "+ Nova categoria"
- Editar / Excluir em cada item
- Modal de criação/edição com campos: nome, cor (color picker), ícone (select simples)

### Tela 4 — Contas (CRUD simples)
O que mostra:
- Lista de contas bancárias (nome, tipo, saldo)
- Botão "+ Nova conta"
- Editar / Excluir
- Modal com campos: nome, tipo (Corrente/Poupança/Carteira), saldo inicial

---

## Navegação entre telas

Use **renderização condicional com estado** — não use React Router:

```tsx
// App.tsx — conceito (NÃO copie isso, implemente do seu jeito)
// Um useState<string> controla qual "página" está ativa
// O header tem links que mudam esse estado
// O conteúdo renderiza condicionalmente baseado no estado
```

Por que sem router: você precisa entender que "navegação" em SPA é apenas estado que decide o que renderizar. Quando fizer no Laravel com Inertia depois, o router do Inertia vai fazer sentido porque você entendeu a mecânica por baixo.

---

## Dados fake (db.json para json-server)

```json
{
  "transactions": [
    {
      "id": 1,
      "description": "Salário",
      "amount": 5000,
      "type": "income",
      "categoryId": 1,
      "accountId": 1,
      "date": "2025-03-01"
    },
    {
      "id": 2,
      "description": "Aluguel",
      "amount": 1500,
      "type": "expense",
      "categoryId": 2,
      "accountId": 1,
      "date": "2025-03-05"
    },
    {
      "id": 3,
      "description": "Freela React",
      "amount": 3450,
      "type": "income",
      "categoryId": 1,
      "accountId": 2,
      "date": "2025-03-10"
    },
    {
      "id": 4,
      "description": "Supermercado",
      "amount": 680,
      "type": "expense",
      "categoryId": 3,
      "accountId": 1,
      "date": "2025-03-12"
    },
    {
      "id": 5,
      "description": "Internet",
      "amount": 120,
      "type": "expense",
      "categoryId": 4,
      "accountId": 1,
      "date": "2025-03-15"
    },
    {
      "id": 6,
      "description": "Uber",
      "amount": 45,
      "type": "expense",
      "categoryId": 5,
      "accountId": 2,
      "date": "2025-03-16"
    },
    {
      "id": 7,
      "description": "Venda curso",
      "amount": 297,
      "type": "income",
      "categoryId": 1,
      "accountId": 2,
      "date": "2025-03-18"
    },
    {
      "id": 8,
      "description": "Farmácia",
      "amount": 89,
      "type": "expense",
      "categoryId": 6,
      "accountId": 1,
      "date": "2025-03-20"
    }
  ],
  "categories": [
    { "id": 1, "name": "Renda", "color": "#22c55e", "icon": "trending-up" },
    { "id": 2, "name": "Moradia", "color": "#ef4444", "icon": "home" },
    { "id": 3, "name": "Alimentação", "color": "#f59e0b", "icon": "utensils" },
    { "id": 4, "name": "Serviços", "color": "#6366f1", "icon": "wifi" },
    { "id": 5, "name": "Transporte", "color": "#06b6d4", "icon": "car" },
    { "id": 6, "name": "Saúde", "color": "#ec4899", "icon": "heart" }
  ],
  "accounts": [
    { "id": 1, "name": "Nubank", "type": "checking", "balance": 4200 },
    { "id": 2, "name": "Inter", "type": "checking", "balance": 1850 },
    { "id": 3, "name": "Carteira", "type": "cash", "balance": 120 }
  ]
}
```

Para rodar: `npx json-server db.json --port 3001`

A API estará em:
- GET/POST `http://localhost:3001/transactions`
- GET/PUT/DELETE `http://localhost:3001/transactions/:id`
- GET/POST `http://localhost:3001/categories`
- GET/POST `http://localhost:3001/accounts`

---

## Fases de construção (conectam com o plano de estudos)

### Fase 1 — Fundação (exercícios 1.x do plano)
**O que construir:**
1. Setup do projeto (Vite + shadcn + Tailwind)
2. Componente `App.tsx` com header e navegação por estado
3. Página Dashboard com os 3 cards de resumo (dados hardcoded)
4. Buscar transações da API com useEffect + fetch + useState
5. Implementar busca com debounce (useEffect com setTimeout/cleanup)

**Conceitos praticados:** useEffect com fetch, cleanup, dependency array, estado básico.

### Fase 2 — Modais e estado de UI (exercícios 2.x do plano)
**O que construir:**
1. Modal de "Nova transação" (primeiro na mão, depois com shadcn Dialog)
2. Fechar com Escape e click fora (useEffect com event listener)
3. Modal de "Editar transação" — abre com dados preenchidos
4. Modal de "Confirmar exclusão"
5. Formulário no modal com validação básica (campos obrigatórios)

**Conceitos praticados:** useState<Item | null> para modais, controle de UI, formulários, callbacks.

### Fase 3 — Componentização (exercícios 3.x do plano)
**O que construir:**
1. Comece com tudo no TransactionsPage (monolítico)
2. Extraia: TransactionFilters, TransactionTable, TransactionRow
3. Extraia: TransactionFormModal (reutilizado para criar e editar)
4. Extraia: DeleteConfirmModal (genérico, reutilizável)
5. Extraia: SummaryCards (reutilizado no Dashboard e em Transações)
6. A página orquestradora deve ficar com ~40-50 linhas

**Conceitos praticados:** identificar responsabilidades, decidir onde o estado vive, props e callbacks, composição.

### Fase 4 — CRUD completo + useRef (exercícios 4.x do plano)
**O que construir:**
1. CRUD de Categorias (tela 3) — reutilize o padrão de modais
2. CRUD de Contas (tela 4) — reutilize o padrão de modais
3. Focus automático no primeiro input ao abrir modal (useRef)
4. Ao criar transação, fazer scroll automático até ela na lista (useRef)
5. Filtros combinados na tela de transações (busca + tipo + categoria)

**Conceitos praticados:** useRef, reutilização de componentes, composição de filtros.

---

## Orientações por tela

### Dashboard — o que pensar antes de codar

O Dashboard mostra um resumo. Os 3 cards calculam totais das transações (receitas, despesas, saldo). A tabela mostra as 5 mais recentes. O input de busca filtra.

Perguntas para se fazer:
- Onde busco as transações? (useEffect no componente da página)
- Onde guardo o resultado? (useState<Transaction[]>)
- Como calculo os totais? (derive do array, não guarde em estado separado — calcule no render)
- Onde fica o estado do termo de busca? (useState<string> no componente de filtro ou na página?)
- O debounce: atraso o fetch ou atraso o filtro local? (filtre local, é mais simples com dados em memória)

### Transações — o que pensar antes de codar

CRUD completo. É a tela mais complexa.

Perguntas para se fazer:
- Tenho 3 modais (criar, editar, excluir). Cada um é um estado separado ou unifico?
  - Criar: `isCreateOpen: boolean`
  - Editar: `editingTransaction: Transaction | null`
  - Excluir: `deletingTransaction: Transaction | null`
- Quando crio/edito/excluo, como atualizo a lista? (fetch de novo? ou atualizo o array local?)
  - Comece com refetch (mais simples). Depois otimize para atualizar localmente se quiser.
- O formulário de criar e editar é o mesmo componente? (sim! mude o título e os dados iniciais)
- Como passo a Transaction para o modal de edição? (via props, controlado pelo estado do pai)

### Categorias e Contas — o que pensar antes de codar

São mais simples que Transações. Se você fez Transações bem, essas vão fluir.

O exercício mental aqui é: quanto código você consegue reutilizar?
- O DeleteConfirmModal pode ser genérico (recebe título, mensagem, onConfirm)
- O padrão de listar + criar + editar + excluir é idêntico
- Muda: os campos do formulário e os dados

---

## Types (crie em src/types/index.ts)

Defina você mesmo os types. Pense:
- Transaction precisa de: id, description, amount, type, categoryId, accountId, date
- Category precisa de: id, name, color, icon
- Account precisa de: id, name, type, balance

Não esqueça de tipar o estado dos modais, as props dos componentes, e os callbacks.

---

## O que NÃO fazer

- Não use biblioteca de gerenciamento de estado (Redux, Zustand, Jotai)
- Não use React Router — navegue com estado
- Não use TanStack Query — faça fetch manual
- Não use react-hook-form — controle formulários com useState
- Não copie código de tutorial — digite tudo
- Não peça código pronto pro Claude — peça explicação de conceitos

## O que você PODE fazer

- Usar shadcn/ui para componentes visuais (Dialog, Button, Input, Select, Table)
- Usar Tailwind para estilizar
- Usar Lucide para ícones
- Me perguntar quando travar — mas traga o que você tentou

---

## Quando estiver pronto

Quando terminar este projeto, você terá:
- Entendimento real de useEffect (fetch, debounce, event listeners, cleanup)
- Domínio de modais com estado (abrir, fechar, passar dados, receber de volta)
- Prática de componentização (quebrando telas grandes em peças reutilizáveis)
- Experiência com useRef (focus, scroll)
- Um projeto no GitHub para mostrar

E mais importante: quando voltar para o Laravel com Inertia, tudo vai fazer sentido.
O `router.post()` do Inertia é o fetch que você fez na mão.
O `useForm()` do Inertia é o useState de formulário que você controlou manualmente.
O Dialog do shadcn é o modal que você já sabe como funciona por dentro.

A dor que você sentir aqui é o investimento que paga dividendos depois.