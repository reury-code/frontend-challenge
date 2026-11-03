## Context

O Carrinho e a Cotação pertencem ao contexto Pedido (`src/pedido/`). A Cotação é a resposta da API e é a referência para finalizar o pedido (glossário). Hoje não existe código em `src/`, e `src/catalogo/` está fora do escopo.

## Goals / Non-Goals

**Goals:**
- Aplicar e remover cupom no Carrinho.
- Mostrar desconto e subtotal com desconto como strings decimais em ETH.
- Cupom inválido ou expirado não altera o Carrinho.

**Non-Goals:**
- Taxa de rede, total, pagamento e confirmação.
- Qualquer mudança em `src/catalogo/`.
- Cenários além dos 3 aprovados.

## Decisions

- **A Cotação é a fonte do desconto.** A tela exibe os valores que a Cotação devolve e não recalcula o desconto no cliente. Isso mantém o princípio de que o colecionador não paga valor diferente do que viu. Alternativa descartada: calcular o desconto localmente, porque poderia divergir da Cotação.
- **Valores em ETH como string decimal.** Nunca `number`, para evitar erro de ponto flutuante. Aritmética de ETH, quando necessária, usa decimal exato.
- **Erro de cupom não muda o estado.** Ao aplicar um cupom rejeitado, o estado do Carrinho e da Cotação anteriores é preservado, e só uma mensagem é exibida.
- **Tudo em `src/pedido/`.** Nenhum arquivo fora dessa pasta é tocado.

## Risks / Trade-offs

- [O contrato da API de cupom na Cotação ainda não foi confirmado] → verificar o `README.md` do desafio (§5 "Cotação") antes de implementar e registrar qualquer divergência.
- [Os cenários só cobrem "Cupom expirado"] → o texto de outros casos de cupom inválido não está especificado. Pergunte ao dono do negócio antes de acrescentar cenário ou mensagem.

## Open Questions

- Qual a mensagem para um código inexistente? Não há cenário, então fica fora desta change até o dono do negócio definir.
- Arredondamento do desconto quando o valor não for exato. Não há cenário, e o requisito fica indefinido por enquanto.
