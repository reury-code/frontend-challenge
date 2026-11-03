## 1. Cotação e valores

- [ ] 1.1 Em `src/pedido/`, expor na Cotação o desconto e o subtotal com desconto como strings decimais em ETH
- [ ] 1.2 Garantir que o estado sem cupom mostre desconto "0.00" e subtotal com desconto igual ao subtotal

## 2. Aplicar e remover cupom

- [ ] 2.1 Em `src/pedido/`, implementar a ação de aplicar cupom no Carrinho e atualizar a Cotação com o desconto devolvido
- [ ] 2.2 Implementar a ação de remover cupom, voltando desconto a "0.00" e subtotal com desconto ao valor cheio
- [ ] 2.3 Ao aplicar cupom inválido ou expirado, preservar o estado anterior e exibir a mensagem (ex.: "Cupom expirado")

## 3. Interface

- [ ] 3.1 Adicionar em `src/pedido/` o campo de cupom no Carrinho, com botões de aplicar e remover
- [ ] 3.2 Exibir na tela a mensagem de erro, o desconto e o subtotal com desconto

## 4. Testes dos cenários

- [ ] 4.1 Teste: aplicar cupom válido ("PRIMEIRA10" em subtotal "1.00" → desconto "0.10", subtotal com desconto "0.90")
- [ ] 4.2 Teste: cupom inválido ou expirado ("NATAL2024" → "Cupom expirado", desconto "0.00", subtotal "1.00")
- [ ] 4.3 Teste: remover cupom (desconto volta a "0.00", subtotal com desconto volta a "1.00")
