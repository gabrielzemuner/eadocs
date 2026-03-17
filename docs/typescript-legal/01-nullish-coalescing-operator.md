---
title: Nullish Coalescing Operator
description: Valor padrão apenas para null/undefined (sem confundir com 0, "", false).
---

O **Nullish Coalescing Operator (`??`)** serve para definir um **valor padrão** quando uma variável é `null` ou `undefined`.

A diferença principal em relação ao `||` é que o `||` considera vários valores como “falsy”, por exemplo: `0`, `""`, `false`.

---

## Exemplo: quando o valor existe

```js
let idade = 27;

console.log("Sua idade é: " + idade); // => 27
```

---

## Exemplo: quando o valor é null

```js
let idade = null;

console.log("Sua idade é: " + idade); // => null
```

---

## Solução com `||` (cuidado com valores falsy)

```js
let idade = null;

console.log("Sua idade é: " + (idade || "Não informado")); // => "Não informado"
```

Só que se a idade for `0` (um valor real!), `||` também troca:

```js
let idade = 0;

console.log("Sua idade é: " + (idade || "Não informado")); // => "Não informado" (não era o que a gente queria)
```

:::note
`0`, `""`, `false`, `null`, `undefined` são todos considerados *falsy* (valores não válidos) pelo `||`.
:::

---

## Solução com `??` (comportamento correto)

```js
let idade = 0;

console.log("Sua idade é: " + (idade ?? "Não informado")); // => 0
```

:::tip
Use `??` quando você quer fallback **somente** para `null/undefined`.
:::