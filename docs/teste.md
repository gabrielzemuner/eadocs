# Teste

This page demonstrates some of the built-in markdown extensions provided by VitePress.

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



![imagem](https://raw.githubusercontent.com/gabrielzemuner/eadocs/refs/heads/main/docs/images/teste-img-4.png)