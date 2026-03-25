# React — Guia de Referência Conceitual
### O que cada coisa é, como funciona, quando usar

> Este documento é para consultar ANTES e DURANTE os exercícios.
> Tem exemplos mínimos de sintaxe — o esqueleto de cada conceito.
> Não tem soluções dos exercícios — tem vocabulário para você construir as suas.

---

## 1. Renderização e re-render

### O que é

Quando o React "renderiza" um componente, ele executa a função do componente do início ao fim e gera o JSX que será mostrado na tela. Na primeira vez, isso se chama **montagem** (mount). Nas vezes seguintes, se chama **re-render**.

### Quando acontece um re-render

Um componente re-renderiza quando:
- O **estado** dele muda (via useState)
- As **props** que ele recebe mudam
- O **componente pai** re-renderiza

### O que NÃO causa re-render

- Mudar uma variável normal (let/const) dentro do componente — o React não sabe que ela mudou
- Mudar um useRef — a ref muda silenciosamente sem avisar o React

### Por que isso importa

```tsx
// ❌ Isso NÃO funciona — a tela nunca atualiza
function Contador() {
  let valor = 0

  return (
    <button onClick={() => { valor += 1; console.log(valor) }}>
      {valor}
    </button>
  )
}
// O console mostra 1, 2, 3... mas a tela fica em 0.
// O React não sabe que 'valor' mudou. Por isso existe o useState.
```

---

## 2. useState — estado

### O que é

É um hook que cria uma "variável especial" que o React observa. Quando você altera o valor dessa variável (via função setter), o React re-renderiza o componente com o novo valor.

### Anatomia

```tsx
import { useState } from 'react'

// A sintaxe básica:
const [valor, setValor] = useState(valorInicial)
//      ↑         ↑                    ↑
//   leitura   escrita         valor da primeira render

// Exemplos com tipos diferentes:
const [nome, setNome] = useState('')                        // string
const [idade, setIdade] = useState(0)                       // number
const [ativo, setAtivo] = useState(false)                   // boolean
const [itens, setItens] = useState<string[]>([])            // array tipado
const [usuario, setUsuario] = useState<User | null>(null)   // objeto ou null
```

### O setter não atualiza imediatamente

```tsx
const [count, setCount] = useState(0)

function handleClick() {
  setCount(1)
  console.log(count) // ainda mostra 0! O novo valor só vem no próximo render.
}
```

### Atualizando arrays e objetos (sem mutar)

```tsx
// ❌ ERRADO — muta o array original, React não detecta mudança
itens.push('novo')
setItens(itens)

// ✅ CERTO — cria um array novo
setItens([...itens, 'novo'])                    // adicionar
setItens(itens.filter(item => item.id !== id))  // remover
setItens(itens.map(item =>                      // atualizar um item
  item.id === id ? { ...item, nome: 'novo' } : item
))

// ❌ ERRADO — muta o objeto original
usuario.nome = 'novo'
setUsuario(usuario)

// ✅ CERTO — cria objeto novo com spread
setUsuario({ ...usuario, nome: 'novo' })
```

### Forma funcional do setter

```tsx
// Quando o novo valor depende do anterior, use a forma funcional:
setCount(anterior => anterior + 1)

// Isso garante que você sempre trabalha com o valor mais atual,
// mesmo dentro de closures (setInterval, setTimeout, event listeners).
```

---

## 3. useEffect — efeitos colaterais

### O que é

É um hook que executa código **depois** que o componente renderiza. Serve para "efeitos colaterais" — coisas que não são calcular o JSX: buscar dados, criar timers, ouvir eventos.

### O modelo mental correto

Pense no useEffect como: **"depois que a tela atualizar, sincronize tal coisa."**

### As 3 formas

```tsx
import { useEffect } from 'react'

// FORMA 1 — Sem array: roda depois de CADA render (montagem + todo re-render)
useEffect(() => {
  console.log('rodou depois de um render')
})

// FORMA 2 — Array vazio: roda UMA VEZ depois da montagem
useEffect(() => {
  console.log('rodou só na montagem')
}, [])

// FORMA 3 — Com dependências: roda na montagem E quando os valores mudam
useEffect(() => {
  console.log('busca mudou para:', busca)
}, [busca])
//  ↑ array de dependências — o React compara com o valor anterior
```

### Exemplo real: atualizar título do browser

```tsx
const [pagina, setPagina] = useState('dashboard')

useEffect(() => {
  document.title = `DevFinance — ${pagina}`
}, [pagina])
// Cada vez que 'pagina' muda, o título do browser atualiza.
```

### Quando NÃO usar useEffect

```tsx
// ❌ ERRADO — criar estado derivado com useEffect
const [transactions, setTransactions] = useState<Transaction[]>([])
const [total, setTotal] = useState(0)

useEffect(() => {
  setTotal(transactions.reduce((sum, t) => sum + t.amount, 0))
}, [transactions])

// ✅ CERTO — calcular direto no corpo do componente
const [transactions, setTransactions] = useState<Transaction[]>([])
const total = transactions.reduce((sum, t) => sum + t.amount, 0)
// Sem useEffect, sem useState extra. Recalcula a cada render automaticamente.
```

---

## 4. Cleanup — limpeza de effects

### O que é

A função que o useEffect **retorna** é o cleanup. Executa em dois momentos:
1. **Antes** do effect rodar de novo (quando dependências mudam)
2. Quando o componente é **desmontado** (removido da tela)

### A anatomia

```tsx
useEffect(() => {
  // --- SETUP: o que acontece quando o effect roda ---
  const id = setInterval(() => {
    console.log('tick')
  }, 1000)

  // --- CLEANUP: o que acontece quando precisa limpar ---
  return () => {
    clearInterval(id)
  }
}, [])
```

### Por que existe — o problema sem cleanup

```tsx
// Sem cleanup, se o componente sai da tela,
// o setInterval continua rodando no vazio = memory leak.
// O console continua logando "tick" para sempre.

// Com cleanup, o React chama clearInterval quando o componente desmonta.
// O interval para. Sem memory leak.
```

### Pares de setup / cleanup

```tsx
// setTimeout → clearTimeout
useEffect(() => {
  const id = setTimeout(() => { /* ... */ }, 500)
  return () => clearTimeout(id)
}, [dependencia])

// addEventListener → removeEventListener
useEffect(() => {
  const handler = (e: KeyboardEvent) => { /* ... */ }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [])

// setInterval → clearInterval
useEffect(() => {
  const id = setInterval(() => { /* ... */ }, 1000)
  return () => clearInterval(id)
}, [])
```

### Quando NÃO precisa de cleanup

```tsx
// Fetch simples que só atualiza estado — sem cleanup necessário
useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => setData(data))
}, [])
// Não cria nada persistente, então não tem nada para limpar.
```

---

## 5. fetch — buscar dados

### O que é

`fetch` é uma função nativa do browser que faz requisições HTTP. Retorna uma **Promise**.

### O padrão básico no React

```tsx
const [dados, setDados] = useState<Item[]>([])
const [loading, setLoading] = useState(true)
const [erro, setErro] = useState<string | null>(null)

useEffect(() => {
  fetch('http://localhost:3001/transactions')
    .then(response => {
      if (!response.ok) throw new Error('Erro na requisição')
      return response.json()
    })
    .then(data => {
      setDados(data)
      setLoading(false)
    })
    .catch(err => {
      setErro(err.message)
      setLoading(false)
    })
}, [])
```

### Mesmo padrão com async/await

```tsx
useEffect(() => {
  // useEffect NÃO pode ser async diretamente.
  // Mas você pode criar uma função async dentro e chamá-la:
  async function carregarDados() {
    try {
      const response = await fetch('http://localhost:3001/transactions')
      if (!response.ok) throw new Error('Erro na requisição')
      const data = await response.json()
      setDados(data)
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  carregarDados()
}, [])
```

### POST, PUT, DELETE

```tsx
// POST — criar
const response = await fetch('http://localhost:3001/transactions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ description: 'Salário', amount: 5000, type: 'income' }),
})

// PUT — atualizar (envia o objeto inteiro)
await fetch(`http://localhost:3001/transactions/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(transacaoAtualizada),
})

// DELETE — excluir
await fetch(`http://localhost:3001/transactions/${id}`, {
  method: 'DELETE',
})
```

---

## 6. Debounce — atrasar execução

### O que é

Debounce NÃO é um hook. É uma **técnica**: "espere o usuário parar de fazer algo por X milissegundos antes de executar uma ação."

### O mecanismo

```
Usuário digita: s → su → sup → supa → [para de digitar]
                 ↓    ↓     ↓     ↓
setTimeout:    500ms 500ms 500ms 500ms → executa!
               ↑     ↑     ↑
             cancelado cada vez que uma nova letra chega
```

### Como implementar no React

É a combinação de: useState + useEffect + setTimeout + cleanup.

```tsx
const [busca, setBusca] = useState('')
const [resultados, setResultados] = useState<Item[]>([])

// O input atualiza 'busca' instantaneamente (a cada tecla)
// O useEffect observa 'busca' e espera 500ms para agir

useEffect(() => {
  const timeoutId = setTimeout(() => {
    // Aqui dentro é onde você faz a busca/filtro de verdade
    // Só executa se o usuário parou de digitar por 500ms
    console.log('buscando por:', busca)
  }, 500)

  return () => clearTimeout(timeoutId) // cancela o timeout anterior
}, [busca])
// Cada tecla: cleanup cancela o timeout antigo → cria um novo → espera 500ms
```

---

## 7. setInterval e setTimeout

### setTimeout — executa uma vez depois de X ms

```tsx
// Cria:
const id = setTimeout(() => {
  console.log('executou depois de 2 segundos')
}, 2000)

// Cancela:
clearTimeout(id)
```

### setInterval — repete a cada X ms

```tsx
// Cria:
const id = setInterval(() => {
  console.log('tick — executa a cada 1 segundo')
}, 1000)

// Para:
clearInterval(id)
```

### Armadilha com closures

```tsx
// ❌ PROBLEMA — o interval "congela" o valor do estado
const [count, setCount] = useState(0)

useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1) // 'count' é sempre 0 aqui! (closure capturou o valor inicial)
  }, 1000)
  return () => clearInterval(id)
}, []) // array vazio = effect roda uma vez = closure captura count = 0

// ✅ SOLUÇÃO — forma funcional do setter
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1) // 'prev' é sempre o valor mais atual
  }, 1000)
  return () => clearInterval(id)
}, [])
```

---

## 8. useRef — referências

### O que é

Cria uma "caixa" que guarda um valor mutável. Persiste entre renders, mas mudar NÃO causa re-render.

### Uso 1 — Acessar elemento DOM

```tsx
import { useRef, useEffect } from 'react'

function MeuInput() {
  const inputRef = useRef<HTMLInputElement>(null)
  //                       ↑ tipo do elemento HTML
  //                                          ↑ valor inicial (null até montar)

  useEffect(() => {
    inputRef.current?.focus()  // dá focus no input depois de montar
  }, [])

  return <input ref={inputRef} placeholder="Recebe focus automático" />
  //            ↑ conecta a ref ao elemento
}
```

### Uso 2 — Guardar valor sem causar re-render

```tsx
function Timer() {
  const intervalRef = useRef<number | null>(null)
  //                         ↑ tipo do ID do interval

  function iniciar() {
    intervalRef.current = setInterval(() => {
      console.log('tick')
    }, 1000)
  }

  function parar() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  return (
    <>
      <button onClick={iniciar}>Iniciar</button>
      <button onClick={parar}>Parar</button>
    </>
  )
}
```

### Uso 3 — Scroll até um elemento

```tsx
const bottomRef = useRef<HTMLDivElement>(null)

// Quando quiser fazer scroll até o final:
bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

// No JSX, coloque um div vazio no final da lista:
return (
  <div>
    {mensagens.map(m => <p key={m.id}>{m.text}</p>)}
    <div ref={bottomRef} />
  </div>
)
```

### Diferença chave: useState vs useRef

| | useState | useRef |
|---|---|---|
| Muda → re-render? | Sim | Não |
| Persiste entre renders? | Sim | Sim |
| Valor atualizado quando? | No próximo render | Imediatamente |
| Uso principal | Dados que afetam a UI | Valores auxiliares, referências DOM |

---

## 9. Props e callbacks

### O que são props

Props são os argumentos que um componente recebe do pai. São **somente leitura**.

```tsx
// Definindo o tipo das props:
interface CardProps {
  titulo: string
  valor: number
  cor?: string  // opcional (?)
}

// O componente recebe as props:
function Card({ titulo, valor, cor = 'blue' }: CardProps) {
  return (
    <div style={{ color: cor }}>
      <h3>{titulo}</h3>
      <p>{valor}</p>
    </div>
  )
}

// O pai usa o componente passando as props:
<Card titulo="Receitas" valor={8450} cor="green" />
<Card titulo="Despesas" valor={3280} />  {/* cor usa o default 'blue' */}
```

### Callbacks — funções como props

```tsx
// O pai define a função e passa para o filho:
interface ModalProps {
  item: Transaction
  onSave: (dados: Transaction) => void  // callback tipado
  onClose: () => void
}

// O filho chama quando algo acontece:
function EditModal({ item, onSave, onClose }: ModalProps) {
  const [nome, setNome] = useState(item.description)

  function handleSubmit() {
    onSave({ ...item, description: nome })  // notifica o pai com os dados
    onClose()                                 // pede pro pai fechar o modal
  }

  return (
    <div>
      <input value={nome} onChange={e => setNome(e.target.value)} />
      <button onClick={handleSubmit}>Salvar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  )
}

// No pai:
function PaginaTransacoes() {
  const [editando, setEditando] = useState<Transaction | null>(null)

  function handleSave(dados: Transaction) {
    // atualiza a lista...
    setEditando(null) // fecha o modal
  }

  return (
    <>
      {/* ... tabela ... */}
      {editando && (
        <EditModal
          item={editando}
          onSave={handleSave}
          onClose={() => setEditando(null)}
        />
      )}
    </>
  )
}
```

---

## 10. Renderização condicional

### Com && (se verdadeiro, mostra)

```tsx
{isLoading && <p>Carregando...</p>}

{erro && <p style={{ color: 'red' }}>{erro}</p>}

{items.length > 0 && <Lista items={items} />}

// ⚠️ Cuidado com número 0:
{count && <p>{count}</p>}     // ❌ se count = 0, renderiza "0" na tela
{count > 0 && <p>{count}</p>} // ✅ correto
```

### Com ternário (se/senão)

```tsx
{isLoading ? <p>Carregando...</p> : <Lista items={items} />}

{user ? <p>Olá, {user.name}</p> : <p>Faça login</p>}
```

### Modal com estado null (o padrão mais útil)

```tsx
const [editando, setEditando] = useState<Item | null>(null)

// Se editando não é null → mostra o modal com os dados
// Se é null → não mostra nada
{editando && <EditModal item={editando} onClose={() => setEditando(null)} />}

// Para abrir: setEditando(itemClicado)
// Para fechar: setEditando(null)
```

---

## 11. Listas e keys

### Renderizando listas

```tsx
const frutas = ['Maçã', 'Banana', 'Laranja']

return (
  <ul>
    {frutas.map(fruta => (
      <li key={fruta}>{fruta}</li>
    ))}
  </ul>
)
```

### Com objetos — use id como key

```tsx
const transactions = [
  { id: 1, description: 'Salário', amount: 5000 },
  { id: 2, description: 'Aluguel', amount: -1500 },
]

return (
  <table>
    <tbody>
      {transactions.map(t => (
        <tr key={t.id}>
          <td>{t.description}</td>
          <td>{t.amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
```

### Regras de key

```tsx
// ✅ Use id único do dado
<li key={item.id}>

// ❌ Nunca use índice se a lista muda (adiciona, remove, reordena)
<li key={index}>  // bugs visuais garantidos

// A key é única entre irmãos, não globalmente
```

---

## 12. Eventos no React

### Sintaxe básica

```tsx
// onClick — clique
<button onClick={() => console.log('clicou')}>Clique</button>

// onChange — mudança em input
<input onChange={(e) => setNome(e.target.value)} />
//                 ↑ objeto do evento
//                     ↑ .target é o elemento HTML
//                          ↑ .value é o texto digitado

// onSubmit — submit de formulário
<form onSubmit={(e) => {
  e.preventDefault()  // impede o reload da página
  handleSubmit()
}}>
```

### Eventos úteis para modais

```tsx
// Fechar ao pressionar Escape (useEffect + addEventListener):
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose()
    }
  }
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])

// Fechar ao clicar no overlay (mas NÃO no conteúdo):
<div className="overlay" onClick={onClose}>
  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
    {/* stopPropagation impede o click de "subir" para o overlay */}
    {children}
  </div>
</div>
```

### Input controlado (controlled component)

```tsx
// O React controla o valor do input via estado:
const [email, setEmail] = useState('')

<input
  type="email"
  value={email}                            // valor vem do estado
  onChange={(e) => setEmail(e.target.value)} // cada tecla atualiza o estado
/>
// O estado é a "fonte da verdade". O input só reflete o que o estado diz.
```

---

## 13. Glossário rápido

| Termo | O que é |
|-------|---------|
| **Montagem (mount)** | Primeira vez que o componente aparece na tela |
| **Desmontagem (unmount)** | Quando o componente é removido da tela |
| **Re-render** | Quando o componente executa de novo por mudança de estado/props |
| **Estado (state)** | Dados que o componente "lembra" entre renders |
| **Props** | Dados que o componente recebe do pai |
| **Efeito colateral (side effect)** | Qualquer coisa que não é calcular JSX: fetch, timers, DOM |
| **Cleanup** | Função retornada pelo useEffect que limpa o que o effect criou |
| **Derivar estado** | Calcular um valor a partir do estado existente, sem criar outro useState |
| **Lifting state up** | Mover o estado para o componente pai quando dois filhos precisam dele |
| **Closure** | Função que "lembra" das variáveis do escopo onde foi criada |
| **Promise** | Objeto que representa um valor que vai existir no futuro (async) |
| **Memory leak** | Quando algo continua consumindo memória após não ser mais necessário |
| **Debounce** | Técnica de esperar X ms após a última ação antes de executar algo |
| **Controlled component** | Input cujo valor é controlado por useState (valor + onChange) |
| **Uncontrolled component** | Input que gerencia seu próprio valor (usa ref para ler) |
| **Callback** | Função passada como argumento para ser chamada depois |
| **Handler** | Função que lida com um evento (ex: handleClick, handleSubmit) |
| **Composição** | Construir componentes grandes a partir de componentes menores |

---

## Como usar este documento

1. **Antes de cada fase do plano:** releia as seções relevantes
2. **Quando travar num exercício:** volte aqui e releia a teoria + exemplos
3. **Quando não lembrar a sintaxe:** consulte o exemplo mínimo da seção
4. **Não decore:** releia quantas vezes precisar. Com prática, internaliza

A ordem de consulta por fase do plano:
- **Fase 1 (useEffect):** Seções 1, 2, 3, 4, 5, 6, 7
- **Fase 2 (modais):** Seções 2, 9, 10, 12 (especialmente stopPropagation e Escape)
- **Fase 3 (componentização):** Seções 9, 10, 11
- **Fase 4 (useRef):** Seção 8