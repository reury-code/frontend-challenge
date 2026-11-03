# Cupom no Carrinho Specification

**Approved**: pending - aguardando respostas às perguntas abertas e aprovação do usuário

Contexto: Pedido (`src/pedido/`). Termos do glossário do CLAUDE.md: Carrinho, Cotação, Pedido, Preço.

## Problem Statement

O colecionador precisa aplicar e remover um cupom no Carrinho e ver na Cotação o desconto e o subtotal com desconto, em ETH. Um cupom inválido ou expirado não pode alterar o Carrinho nem os valores da Cotação. Esta feature sustenta o núcleo do projeto: o colecionador nunca vê um valor que a Cotação não confirma (README §3 "Carrinho").

## Goals

- [ ] Aplicar um cupom válido faz a Cotação mostrar desconto e subtotal com desconto corretos, em strings decimais com 2 casas (ex.: `"0.10"` e `"0.90"`).
- [ ] Um cupom inválido ou expirado deixa o Carrinho e a Cotação exatamente como estavam e mostra a mensagem do motivo.
- [ ] Remover o cupom devolve desconto `"0.00"` e subtotal com desconto igual ao subtotal.

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Alterações em `src/catalogo/` | Pedido do usuário: mexer só no contexto Pedido |
| Taxa de rede e total na Cotação | A descrição da feature cita só desconto e subtotal com desconto; ver pergunta Q8 |
| Revalidação do cupom no Pagamento e criação do Pedido | Fase de Pagamento, outra feature |
| Edição de quantidades e remoção de itens do Carrinho | Outra feature do Carrinho |
| Cadastro de cupons, regras de elegibilidade por NFT | Cupons vêm da API simulada; a spec só consome o resultado |

---

## Assumptions & Open Questions

Nenhum cenário além dos três dados foi criado. Tudo que a descrição não resolve está abaixo como pergunta; nenhuma delas virou critério.

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Os valores de ETH trafegam e aparecem como strings decimais com 2 casas | `"1.00"`, `"0.10"`, `"0.90"` | Formato dos três cenários e README §3 (strings decimais) | y - cenários do usuário |
| A Cotação da API é a fonte de desconto e subtotal com desconto; a interface não calcula esses valores | Interface exibe o que a Cotação devolve | README §3: "A cotação da API é a referência" | y - README |

**Open questions** (aguardam resposta do usuário; recomendação entre parênteses):

- **Q1 - Cupom inexistente.** O cenário só fixa a mensagem "Cupom expirado". Qual a mensagem para um código que não existe? (Recomendo "Cupom inválido".)
- **Q2 - Cupom já aplicado.** Se há "PRIMEIRA10" aplicado e o colecionador aplica um segundo código válido, o novo substitui o anterior ou é recusado? (Recomendo substituir: um cupom por Carrinho.)
- **Q3 - Cupom aplicado e código novo inválido.** Com "PRIMEIRA10" aplicado, se o colecionador tenta "NATAL2024" (expirado), o cupom atual permanece? (Recomendo permanecer, coerente com "não altera o Carrinho".)
- **Q4 - Arredondamento.** Para um subtotal em que 10% não cai em 2 casas (ex.: `"0.55"`, desconto 0.055), arredonda para cima, para baixo ou a Cotação define? Precisão: o README exige "precisão nos cálculos".
- **Q5 - Carrinho mudou com cupom aplicado.** Se a quantidade ou um Preço muda (inclusive por `nft.updated`), a Cotação recalcula o desconto mantendo o cupom? (Recomendo sim, nova Cotação com o mesmo cupom.)
- **Q6 - Código vazio ou com espaços/caixa diferente.** "primeira10" e " PRIMEIRA10 " valem? Código vazio bloqueia o envio ou mostra mensagem? (Recomendo ignorar caixa e espaços nas pontas; vazio mostra "Informe o código do cupom".)
- **Q7 - Falha da Cotação ao aplicar.** Se a API falha (rede, 5xx), qual a mensagem? O Carrinho continua intacto? (Recomendo intacto, com mensagem de falha transitória e nova tentativa.)
- **Q8 - Taxa de rede e total.** Entram nesta feature? O README §3 lista "subtotal, desconto, taxa de rede e total", mas sua descrição cita só desconto e subtotal com desconto. (Recomendo ficar fora; outra feature.)
- **Q9 - Persistência.** O cupom aplicado sobrevive a refresh e é preservado do visitante ao autenticar, como o Carrinho? (Recomendo sim, o cupom acompanha o Carrinho.)
- **Q10 - Visitante.** O visitante (não autenticado) pode aplicar cupom, ou só o colecionador autenticado? (README §3 só exige autenticação para checkout.)
- **Q11 - Carrinho vazio.** Aplicar cupom a Carrinho sem itens é bloqueado ou aceito com desconto `"0.00"`?
- **Q12 - Feedback e controles.** Que gesto exato: campo de texto + botão "Aplicar"; botão "Remover" ao lado do cupom aplicado? Rótulos exatos? A mensagem de erro é anunciada a leitores de tela (README §8 pede feedback acessível)? Há estado de carregamento enquanto a Cotação responde? Não há captura do Figma desta tela nos arquivos do repositório; o Figma do README seria a referência binding, preciso que me indique o frame.

---

## User Stories

### P1: Aplicar cupom válido ⭐ MVP

**User Story**: Como colecionador, quero aplicar um cupom ao Carrinho para ver o desconto na Cotação antes de pagar.

**Why P1**: é o objetivo central da feature.

**Acceptance Criteria**:

1. WHEN o colecionador aplica o cupom "PRIMEIRA10", válido e com 10% de desconto, a um Carrinho com subtotal `"1.00"` ETH, THEN the Cotação SHALL mostrar desconto `"0.10"` ETH.  <!-- event-driven -->
2. WHEN o colecionador aplica o cupom "PRIMEIRA10" a um Carrinho com subtotal `"1.00"` ETH, THEN the Cotação SHALL mostrar subtotal com desconto `"0.90"` ETH.  <!-- event-driven -->
3. WHEN o colecionador aplica um cupom válido, THEN the Carrinho SHALL manter os itens e as quantidades inalterados (ex.: 2 unidades de "Aurora #12" a `"0.50"` ETH cada).  <!-- event-driven -->

**Independent Test**: Carrinho com 2 × "Aurora #12" a `"0.50"` ETH; aplicar "PRIMEIRA10"; ver desconto `"0.10"` e subtotal com desconto `"0.90"`.

---

### P1: Cupom inválido ou expirado não altera o Carrinho ⭐ MVP

**User Story**: Como colecionador, quero que um cupom errado ou vencido seja recusado sem mexer nos valores, para nunca ver um total que não vale.

**Why P1**: protege o núcleo "nunca pagar um valor diferente do que viu confirmado".

**Acceptance Criteria**:

1. WHEN o colecionador aplica o cupom "NATAL2024", expirado em 25/12/2024, a um Carrinho sem cupom, THEN the tela SHALL mostrar a mensagem "Cupom expirado".  <!-- event-driven -->
2. IF o cupom aplicado está expirado THEN the Cotação SHALL manter desconto `"0.00"` ETH.  <!-- unwanted-behavior -->
3. IF o cupom aplicado está expirado THEN the Cotação SHALL manter subtotal com desconto igual ao subtotal anterior (`"1.00"` ETH no cenário).  <!-- unwanted-behavior -->
4. IF o cupom aplicado é inválido ou expirado THEN the Carrinho SHALL manter itens e quantidades inalterados.  <!-- unwanted-behavior -->

**Independent Test**: Carrinho com subtotal `"1.00"`, sem cupom; aplicar "NATAL2024"; ver "Cupom expirado", desconto `"0.00"`, subtotal `"1.00"`.

Pendente: mensagem de código inexistente (Q1), cupom já aplicado (Q3), falha de rede (Q7).

---

### P1: Remover cupom ⭐ MVP

**User Story**: Como colecionador, quero remover o cupom aplicado para voltar ao valor cheio.

**Why P1**: sem remover, o colecionador não desfaz uma escolha; README §3 exige "aplicar e remover".

**Acceptance Criteria**:

1. WHEN o colecionador remove o cupom "PRIMEIRA10" de um Carrinho com subtotal `"1.00"` ETH, THEN the Cotação SHALL mostrar desconto `"0.00"` ETH.  <!-- event-driven -->
2. WHEN o colecionador remove o cupom "PRIMEIRA10" de um Carrinho com subtotal `"1.00"` ETH, THEN the Cotação SHALL mostrar subtotal com desconto `"1.00"` ETH.  <!-- event-driven -->
3. WHEN o colecionador remove o cupom, THEN the Carrinho SHALL manter itens e quantidades inalterados.  <!-- event-driven -->

**Independent Test**: Carrinho com "PRIMEIRA10" aplicado (desconto `"0.10"`); remover; ver desconto `"0.00"` e subtotal com desconto `"1.00"`.

---

## Edge Cases

Todos os casos abaixo estão **pendentes de resposta** (ver perguntas) e não viraram critério: cupom inexistente (Q1), segundo cupom (Q2, Q3), arredondamento (Q4), mudança no Carrinho com cupom (Q5), entrada vazia ou com espaços (Q6), falha da API (Q7), persistência (Q9), visitante (Q10), Carrinho vazio (Q11).

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| CUPOM-01 | P1: Aplicar cupom válido (desconto) | - | Pending |
| CUPOM-02 | P1: Aplicar cupom válido (subtotal com desconto) | - | Pending |
| CUPOM-03 | P1: Aplicar cupom válido (Carrinho inalterado) | - | Pending |
| CUPOM-04 | P1: Cupom inválido ou expirado (mensagem) | - | Pending |
| CUPOM-05 | P1: Cupom inválido ou expirado (desconto) | - | Pending |
| CUPOM-06 | P1: Cupom inválido ou expirado (subtotal) | - | Pending |
| CUPOM-07 | P1: Cupom inválido ou expirado (Carrinho inalterado) | - | Pending |
| CUPOM-08 | P1: Remover cupom (desconto) | - | Pending |
| CUPOM-09 | P1: Remover cupom (subtotal com desconto) | - | Pending |
| CUPOM-10 | P1: Remover cupom (Carrinho inalterado) | - | Pending |

**Coverage:** 10 total, 0 mapped to tasks, 10 unmapped ⚠️ (esperado: Design e Tasks ainda não começaram)

---

## Sources

- README.md §3 "Carrinho" - "Aplicar e remover cupom, com tratamento de código inválido ou expirado"; "Exibir subtotal, desconto, taxa de rede e total coerentes com a resposta da API"; valores em ETH como strings decimais.
- README.md §5 tabela "Cotação" - validação de cupom, descontos, taxas e total.
- README.md §6 - cenário determinístico "cupom inválido ou expirado" nos mocks MSW.
- CENARIOS-CUPOM.md - os três cenários do usuário, ponto de partida dos critérios acima.
- CLAUDE.md - glossário (Carrinho, Cotação, Pedido, Preço) e núcleo do projeto.
- Figma do README: nenhum frame desta tela foi exportado para `captures/`; ver Q12.

## Success Criteria

- [ ] Os três cenários do usuário passam como testes automatizados com os valores exatos (`"0.10"`, `"0.90"`, `"0.00"`, `"1.00"`, "Cupom expirado").
- [ ] Nenhum valor de desconto ou subtotal com desconto é calculado fora da Cotação da API.
- [ ] Nenhuma alteração fora de `src/pedido/`.
