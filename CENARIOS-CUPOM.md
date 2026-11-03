# Cenários à mão: cupom no carrinho (contexto Pedido)

Escritos antes de abrir qualquer agente. Origem: README §3 "Carrinho" ("Aplicar e remover cupom, com tratamento de código inválido ou expirado"; "subtotal, desconto, taxa de rede e total") e §3 (valores em ETH como string decimal).

```gherkin
Cenário: aplicar cupom válido
Dado um Carrinho com 2 unidades de "Aurora #12" a 0,50 ETH cada, subtotal "1.00" ETH
Quando o colecionador aplica o cupom "PRIMEIRA10", que dá 10% de desconto
Então a Cotação mostra desconto "0.10" ETH e o subtotal com desconto fica "0.90" ETH
```

```gherkin
Cenário: cupom inválido ou expirado não altera o carrinho
Dado um Carrinho com subtotal "1.00" ETH e nenhum cupom aplicado
Quando o colecionador aplica o cupom "NATAL2024", expirado em 25/12/2024
Então a tela mostra a mensagem "Cupom expirado", o desconto continua "0.00" ETH e o subtotal continua "1.00" ETH
```

```gherkin
Cenário: remover cupom devolve o valor cheio
Dado um Carrinho com subtotal "1.00" ETH e o cupom "PRIMEIRA10" aplicado, desconto "0.10" ETH
Quando o colecionador remove o cupom
Então o desconto volta a "0.00" ETH e o subtotal com desconto volta a "1.00" ETH
```
