## Why

O colecionador precisa aplicar e remover um cupom no Carrinho (README §3 "Carrinho") e ver, na Cotação, o desconto e o subtotal com desconto. Isso sustenta o núcleo do projeto: ele nunca paga um valor diferente do que viu confirmado. Um cupom inválido ou expirado não pode alterar o Carrinho.

## What Changes

- O colecionador aplica um cupom no Carrinho.
- A Cotação mostra o desconto e o subtotal com desconto, em ETH como string decimal (ex.: `"0.10"`, `"0.90"`).
- O colecionador remove o cupom, e o desconto volta a `"0.00"` ETH e o subtotal com desconto volta ao valor cheio.
- Cupom inválido ou expirado mostra uma mensagem (ex.: "Cupom expirado") e não altera o Carrinho nem a Cotação.

Critério de aceite: exatamente os 3 cenários de `CENARIOS-CUPOM.md`, repetidos na spec. Nenhum cenário novo foi adicionado.

## Capabilities

### New Capabilities
- `cupom-carrinho`: aplicar e remover cupom no Carrinho, com desconto e subtotal com desconto na Cotação e tratamento de cupom inválido ou expirado.

### Modified Capabilities
Nenhuma. Ainda não existem specs.

## Impact

- Código futuro: apenas `src/pedido/` (contexto Pedido).
- Fora do escopo: `src/catalogo/` (contexto Catálogo), taxa de rede, total, pagamento e confirmação.
- Hoje não existe código em `src/`. Esta change é só a especificação.
