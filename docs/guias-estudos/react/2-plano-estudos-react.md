# Plano de Estudos: React para o Mundo Real
### Focado em useEffect, estado para UI, e componentização

> **Regra de ouro deste plano:** zero código pronto. Cada exercício te diz *o que* construir e *por que*, nunca *como*. Quando travar, tente por 30 minutos antes de pesquisar.

---

## Fase 1 — useEffect desmistificado (1-2 semanas)

### O modelo mental que você precisa

O useEffect não é "um jeito de rodar código". Ele é uma **sincronização**. Pense assim: "quando X mudar, sincronize Y". Se você não consegue completar essa frase, provavelmente não precisa de useEffect.

### Conceitos para entender antes de codar

Antes de cada exercício, responda mentalmente:

1. **Quando o useEffect sem dependências roda?** (dica: é mais do que "na montagem")
2. **O que acontece se eu colocar um estado no array de dependências e dentro do effect eu alterar esse mesmo estado?**
3. **O que é a função de cleanup e quando ela executa?**

### Exercícios progressivos

**Exercício 1.1 — Relógio digital**
Crie um componente que mostra hora:minuto:segundo atualizando em tempo real.
- Use `setInterval` dentro de um useEffect
- Implemente o cleanup (o que acontece se você não limpar o interval?)
- Teste: remova o componente da tela e veja no console se o interval continua rodando

**O que você vai aprender:** cleanup de effects, por que ele existe, o que é memory leak.

### Resolução Exercício

```tsx
// components/Clock.tsx
import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  console.log("clock renderizou");

  useEffect(() => {
    const id = setInterval(() => {
      console.log("dentro do setInterval => memory leak sem clearInterval");
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <div>
      {time.getHours().toString().padStart(2, "0")}:
      {time.getMinutes().toString().padStart(2, "0")}:
      {time.getSeconds().toString().padStart(2, "0")}
    </div>
  );
}

// App.tsx
import { useState } from "react";
import Clock from "./components/Clock";

export default function App() {
  const [showClock, setShowClock] = useState<boolean>(true);

  console.log("app renderizou");

  return (
    <div>
      <button onClick={() => setShowClock((prev) => !prev)}>
        {showClock ? "Esconder" : "Exibir"}
      </button>
      <h1>Relógio Digital</h1>
      {showClock && <Clock />}
    </div>
  );
}
```

**Exercício 1.2 — Busca com debounce**
Crie um input de texto. Conforme o usuário digita, faça uma busca na API pública `https://jsonplaceholder.typicode.com/users?q={termo}` — mas só depois que o usuário PARAR de digitar por 500ms.
- O input é controlado por useState
- O useEffect observa o valor do input
- Dentro do effect, use setTimeout para esperar 500ms
- O cleanup cancela o timeout anterior

**O que você vai aprender:** dependency array na prática, cleanup com clearTimeout, por que effects re-executam.

### Resolução Exercício

```tsx
interface User {
  id: number;
  name: string;
}

function Ex02() {
  // Exercício debounce
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  // buscar dados no mount
  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users`)
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  // debounce
  useEffect(() => {
    const id = setTimeout(() => {
      console.log("setTimeout renderizou");
    }, 500);

    return () => {
      clearTimeout(id);
    };
  }, [search]);

  return (
    <div>
      <input type="text" onChange={(e) => setSearch(e.target.value)} />
      <div>{search}</div>
      <div>
        <ul>
          {filteredUsers.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

**Exercício 1.3 — Tema escuro/claro persistente**
Crie um toggle dark/light mode. O tema escolhido deve sobreviver ao reload da página.
- Um useEffect lê do localStorage na montagem
- Outro useEffect salva no localStorage quando o tema muda
- Adicione uma classe no `<body>` ou `<html>` baseado no tema

**O que você vai aprender:** dois useEffects no mesmo componente (cada um com responsabilidade diferente), diferença entre effect de "leitura inicial" e effect de "sincronização".

### Resolução Exercício

```tsx
function Ex03() {
  console.log('renderizou')

  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const storage = localStorage.getItem("dark-mode");
    const bool = storage === "true";
    setDarkMode(bool);
  }, []);

  // const [darkMode, setDarkMode] = useState(() => {
  //   const storage = localStorage.getItem("dark-mode");
  //   const bool = storage === "true";
  //   return storage === null ? true : bool;
  // });

  useEffect(() => {
    localStorage.setItem("dark-mode", darkMode.toString());

    if (darkMode) {
      document.documentElement.classList.add("dark-mode");
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.documentElement.classList.add("light-mode");
    }
  }, [darkMode]);

  return (
    <div>
      <button onClick={() => setDarkMode((prev) => !prev)}>
        {darkMode ? "Light" : "Dark"}
      </button>
    </div>
  );
}
```

**Exercício 1.4 — Listener de teclado**
Crie um componente que mostra qual tecla foi pressionada por último. Quando o componente sair da tela, o listener deve ser removido.
- `addEventListener` no useEffect, `removeEventListener` no cleanup
- Use `window` como alvo do evento

**O que você vai aprender:** effects que interagem com APIs do browser, cleanup de event listeners.

### Checklist de entendimento (só avance quando responder tudo)

- [ ] Sei a diferença entre `useEffect(() => {}, [])` e `useEffect(() => {})`
- [ ] Entendo por que colocar uma função no array de dependências pode causar loop infinito
- [ ] Sei quando preciso de cleanup e quando não preciso
- [ ] Consigo explicar por que useEffect roda DEPOIS do render, não antes

---

## Fase 2 — Estado para controle de UI (1-2 semanas)

### O modelo mental que você precisa

Um modal não é um "elemento que aparece". É um **estado booleano que decide se algo renderiza ou não**. Todo controle de UI (modal aberto, tab ativa, accordion expandido, dropdown visível) é apenas: um useState + renderização condicional.

### Conceitos para internalizar

1. **Estado de UI vs Estado de dados:** `isModalOpen` é estado de UI. `patients` é estado de dados. Eles vivem no mesmo lugar (useState) mas têm naturezas diferentes.
2. **Quem é dono do estado?** O estado vive no componente que PRECISA dele. Se o pai precisa saber se o modal está aberto, o estado fica no pai. Se só o modal precisa saber, fica nele.

### Exercícios progressivos

**Exercício 2.1 — Modal simples do zero (SEM shadcn, SEM biblioteca)**
Crie um modal completamente na mão:
- Um botão "Abrir" no componente pai
- Um `useState<boolean>` que controla se o modal aparece
- O modal é um `<div>` com overlay escuro + caixa branca centralizada
- Botão "Fechar" dentro do modal que muda o estado para false
- Fechar ao clicar no overlay (fora da caixa)
- Fechar ao pressionar Escape (aqui entra o useEffect com event listener!)

**Por que sem biblioteca:** você precisa entender o mecanismo antes de usar a abstração. shadcn é ótimo, mas se você não entende o que ele faz por baixo, qualquer customização vira mistério.

**O que você vai aprender:** estado booleano controlando renderização, evento de teclado com useEffect, event.stopPropagation().

**Exercício 2.2 — Modal com dados (editar item de uma lista)**
- Tenha uma lista de itens (ex: lista de tarefas com nome e status)
- Ao clicar em "Editar" em um item, abre o modal COM os dados daquele item
- O estado agora não é apenas boolean — é o ITEM sendo editado (ou null)
- `useState<Task | null>(null)` — se for null, modal fechado. Se tiver valor, modal aberto com aquele dado.
- Ao salvar no modal, atualiza o item na lista e fecha o modal

**O que você vai aprender:** estado que carrega dados + controla visibilidade ao mesmo tempo. Esse é o padrão que o shadcn usa internamente.

**Exercício 2.3 — Agora sim, refaça com shadcn Dialog**
Refaça o exercício 2.2 usando o `<Dialog>` do shadcn:
- Use `open` e `onOpenChange` do Dialog
- Passe os dados do item via props para o conteúdo do Dialog
- Compare o código: perceba como o shadcn abstraiu o overlay, o Escape, o focus trap — tudo que você fez na mão no 2.1

**O que você vai aprender:** como a biblioteca mapeia para os conceitos que você já aprendeu. Agora `open={!!selectedTask}` faz sentido intuitivamente.

**Exercício 2.4 — Múltiplos estados de UI no mesmo componente**
Crie uma interface com:
- Uma lista de itens
- Um modal de "Criar novo" (estado: `isCreateOpen`)
- Um modal de "Editar" (estado: `editingItem: Item | null`)
- Um modal de "Confirmar exclusão" (estado: `deletingItem: Item | null`)
- Apenas um modal pode estar aberto por vez

**O que você vai aprender:** gerenciar múltiplos estados de UI sem conflito, quando faz sentido unificar estados vs. manter separados.

### Checklist de entendimento

- [ ] Sei a diferença entre `useState<boolean>` e `useState<Item | null>` para modais
- [ ] Entendo quem deve ser "dono" do estado do modal (pai ou filho)
- [ ] Consigo mapear `open` e `onOpenChange` do shadcn para o useState que controla por baixo
- [ ] Sei fechar modal ao clicar fora e ao pressionar Escape, com e sem biblioteca

---

## Fase 3 — Componentização: quando e como quebrar (2-3 semanas)

### O modelo mental que você precisa

Um componente não é "um pedaço de HTML". É uma **unidade de responsabilidade**. Se você consegue dar um NOME claro para o que o pedaço faz, ele merece ser um componente. Se o nome seria "ParteDoMeioDoFormulário", provavelmente não é uma boa quebra.

### As 3 razões legítimas para extrair um componente

1. **Reutilização:** vai usar em mais de um lugar? Extrai.
2. **Complexidade:** o componente pai ficou com mais de ~150 linhas e tem responsabilidades claramente separáveis? Extrai.
3. **Legibilidade:** ler o componente pai ficaria mais fácil se aquele bloco tivesse um nome descritivo? Extrai.

### O que NÃO é razão para extrair

- "Cada div deveria ser um componente" — NÃO
- "Todo formulário precisa ser um componente separado" — DEPENDE
- "Ficou com mais de 50 linhas" — número de linhas sozinho não é critério

### Exercícios progressivos

**Exercício 3.1 — Componente monolítico proposital**
Construa UMA página inteira em UM ÚNICO componente. Sim, tudo junto:
- Header com logo e navegação
- Uma seção de filtros (input de busca + select de categoria)
- Uma lista de cards com imagem, título, descrição e botão
- Um footer

Vai ficar horrível de ler. Esse é o ponto. Agora olhe para o componente e responda:
- Quais pedaços têm responsabilidade própria?
- Quais pedaços você reutilizaria?
- Quais pedaços têm estado próprio que não interessa ao resto?

**Exercício 3.2 — Quebre o monolito**
Pegue o componente do 3.1 e refatore:
- Extraia `Header`, `FilterBar`, `CardList`, `Card`, `Footer`
- Decida: qual estado fica no pai? Qual desce como props? Qual estado é local de cada componente?
- A busca/filtro precisa afetar a lista — como o estado flui?

Regra: o componente pai (Page) deve ficar com no máximo 30-40 linhas, basicamente compondo os filhos.

**O que você vai aprender:** o processo de identificar responsabilidades, decidir onde o estado vive, e como props conectam tudo.

**Exercício 3.3 — Formulário com seções**
Crie um formulário de cadastro de paciente (conecta com o que você estuda) com:
- Dados pessoais (nome, CPF, data de nascimento)
- Dados de contato (telefone, email, endereço)
- Dados do convênio (plano, número da carteirinha)
- Botões de ação (salvar, cancelar)

Comece monolítico. Depois quebre em:
- `PatientPersonalSection` (recebe parte do form state via props)
- `PatientContactSection`
- `PatientInsuranceSection`
- `FormActions`

Decisão crítica: o estado do formulário inteiro fica no pai ou cada seção gerencia o seu?
- Resposta: **o pai é dono do estado do form**. As seções recebem valores e callbacks via props.
- Se usar react-hook-form ou useForm do Inertia, isso fica mais claro — o form é registrado no pai e os inputs nas seções.

**O que você vai aprender:** componentização de formulários grandes (o cenário mais comum no CRUD do dia a dia), lifting state up, callbacks como props.

**Exercício 3.4 — Lista com CRUD completo**
Agora junte tudo: uma página de "Pacientes" com:
- Tabela/lista de pacientes
- Botão "Novo paciente" → abre modal de criação (Exercício 2.3)
- Botão "Editar" em cada linha → abre modal de edição com dados (Exercício 2.2)
- Botão "Excluir" → abre modal de confirmação (Exercício 2.4)
- Filtro por nome no topo (Exercício 1.2 - busca com debounce)

A página principal (`PatientsPage`) deve ser legível em ~40 linhas, apenas orquestrando:
- `PatientFilters`
- `PatientTable`
- `PatientCreateModal`
- `PatientEditModal`
- `PatientDeleteConfirmation`

**O que você vai aprender:** como tudo se conecta — hooks, estado de UI, componentização, props, callbacks. Esse é o padrão real de 80% das telas que você vai construir no Laravel + Inertia.

### Checklist de entendimento

- [ ] Consigo olhar um componente grande e identificar onde "cortar"
- [ ] Sei a diferença entre estado local (do componente) e estado que precisa subir pro pai
- [ ] Entendo o padrão: pai é dono do estado, filho recebe via props e notifica mudanças via callbacks
- [ ] Consigo compor uma página a partir de componentes sem que o Page fique com mais de ~50 linhas

---

## Fase 4 — useRef e outros hooks (1 semana)

### Só depois que as fases 1-3 estiverem sólidas

**useRef** tem dois usos principais. Entenda ambos:

1. **Acessar elemento DOM:** ex: dar focus num input programaticamente, ou fazer scroll até um elemento
2. **Guardar valor mutável que NÃO causa re-render:** ex: guardar o ID de um setTimeout/setInterval para limpar depois, ou guardar o valor anterior de uma prop

### Exercícios

**Exercício 4.1 — Focus automático**
Crie um formulário onde, ao abrir o modal de criação, o primeiro input recebe focus automaticamente.
- Crie uma ref com `useRef<HTMLInputElement>(null)`
- No useEffect (quando o modal abre), chame `ref.current?.focus()`

**Exercício 4.2 — Scroll to bottom no chat**
Crie uma lista de mensagens (como um chat). Quando uma nova mensagem é adicionada, a lista faz scroll automático para o final.
- Use ref no elemento container da lista
- No useEffect que observa o array de mensagens, faça `ref.current?.scrollIntoView()`

**Exercício 4.3 — Valor anterior**
Crie um contador. Ao lado do valor atual, mostre o valor anterior. (ex: "Atual: 5, Anterior: 4")
- Use um useRef para guardar o valor anterior
- Atualize a ref dentro de um useEffect que observa o valor do contador

**O que você vai aprender:** quando useRef é a ferramenta certa vs. useState, a diferença fundamental (ref não causa re-render).

---

## Regras do plano

1. **Faça na ordem.** Cada exercício depende do anterior.
2. **Sem copy-paste.** Digite tudo. A memória muscular importa.
3. **Erre primeiro.** Tente resolver antes de pesquisar. O erro ensina mais que o acerto.
4. **Use TypeScript desde o início** — já que o Inertia te entrega TS, pratique aqui também. Tipar props e estados é a melhor forma de internalizar TS no React.
5. **Um exercício por dia é suficiente.** Melhor fazer um bem feito do que três pela metade.
6. **Quando travar:** releia este plano, pense no modelo mental descrito, tente de novo. Se ainda travar, me pergunte — mas traga o que você tentou.

---

## Conexão com o seu mundo Laravel + Inertia

Tudo neste plano se aplica diretamente ao que você faz com Inertia:

- **useEffect** → você vai usar para reagir a mudanças de props vindas do Laravel (ex: flash messages), para debounce em filtros de tabela, para event listeners
- **Estado de UI para modais** → toda tela de CRUD no Inertia tem modais de criar/editar/deletar controlados por estado React
- **Componentização** → as pages do Inertia (`resources/js/Pages/Patients/Index.tsx`) ficam limpas quando você extrai componentes para `resources/js/Components/`
- **useRef** → focus em inputs de busca, scroll em listas, referências para bibliotecas externas

Ao terminar este plano, o código do curso que você está fazendo vai fazer muito mais sentido, e você vai conseguir ir além do que o instrutor mostra — criando variações, adicionando features, e refatorando com confiança.