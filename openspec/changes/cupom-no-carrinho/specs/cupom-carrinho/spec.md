## ADDED Requirements

### Requirement: Aplicar cupom válido no Carrinho
O sistema SHALL permitir que o colecionador aplique um cupom válido no Carrinho. A Cotação SHALL mostrar o desconto e o subtotal com desconto em ETH, como strings decimais.

#### Scenario: aplicar cupom válido
- **GIVEN** um Carrinho com 2 unidades de "Aurora #12" a 0,50 ETH cada, subtotal "1.00" ETH
- **WHEN** o colecionador aplica o cupom "PRIMEIRA10", que dá 10% de desconto
- **THEN** a Cotação mostra desconto "0.10" ETH e o subtotal com desconto fica "0.90" ETH

### Requirement: Cupom inválido ou expirado não altera o Carrinho
O sistema SHALL mostrar uma mensagem de erro ao aplicar um cupom inválido ou expirado. O sistema MUST NOT alterar o desconto nem o subtotal do Carrinho nesse caso.

#### Scenario: cupom inválido ou expirado não altera o carrinho
- **GIVEN** um Carrinho com subtotal "1.00" ETH e nenhum cupom aplicado
- **WHEN** o colecionador aplica o cupom "NATAL2024", expirado em 25/12/2024
- **THEN** a tela mostra a mensagem "Cupom expirado", o desconto continua "0.00" ETH e o subtotal continua "1.00" ETH

### Requirement: Remover cupom devolve o valor cheio
O sistema SHALL permitir que o colecionador remova o cupom aplicado. Depois da remoção, o desconto SHALL voltar a "0.00" ETH e o subtotal com desconto SHALL voltar ao valor cheio.

#### Scenario: remover cupom devolve o valor cheio
- **GIVEN** um Carrinho com subtotal "1.00" ETH e o cupom "PRIMEIRA10" aplicado, desconto "0.10" ETH
- **WHEN** o colecionador remove o cupom
- **THEN** o desconto volta a "0.00" ETH e o subtotal com desconto volta a "1.00" ETH
