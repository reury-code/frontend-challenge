# DIFERENCAS: cupom no carrinho (contexto Pedido), OpenSpec × TLC

Feature: aplicar e remover cupom no Carrinho. Os mesmos 3 cenários escritos à mão ([CENARIOS-CUPOM.md](CENARIOS-CUPOM.md)) foram dados às duas ferramentas.

- **Acrescentou:** o OpenSpec criou `design.md` e `tasks.md` com decisões que eu não pedi (a Cotação é a fonte do desconto, valores em string decimal, erro de cupom não muda o estado); o TLC acrescentou critérios EARS "Carrinho inalterado" (CUPOM-03, 07 e 10) que não estavam em nenhum cenário meu.
- **Mudou nos meus cenários:** o OpenSpec reescreveu cada cenário como um `Requirement` com `SHALL`/`MUST NOT` e passou Dado/Quando/Então para GIVEN/WHEN/THEN, mantendo os valores e a mensagem "Cupom expirado"; o TLC quebrou os 3 cenários em 10 critérios EARS (CUPOM-01 a CUPOM-10).
- **Pergunta que fez:** nenhuma ferramenta perguntou no meio do caminho (as duas rodaram em sessão não interativa); o OpenSpec deixou 2 perguntas abertas no `design.md` (mensagem para código inexistente, arredondamento do desconto) e o TLC registrou 12 no `spec.md` (Q1 a Q12).

## Validação

- OpenSpec: `openspec validate cupom-no-carrinho` → *Change 'cupom-no-carrinho' is valid*.
- TLC: `validate_spec.py .specs/features/cupom-no-carrinho` → 0 erros, 1 aviso (as perguntas abertas não estão marcadas como resolvidas, o que é verdade).
- Observação honesta: dentro das sessões do agente os comandos de validação foram negados pela permissão; rodei os dois validadores eu mesmo, depois, no terminal. No OpenSpec, por isso, o agente escreveu os arquivos à mão em vez de usar `openspec new change`, e só o validador confirmou que o formato ficou correto.

## Comparação

**Qual perguntou mais:** o TLC, com 12 perguntas contra 2 do OpenSpec. **Qual inventou mais:** o TLC também, que expandiu 3 cenários em 10 critérios e acrescentou o "Carrinho inalterado"; o OpenSpec ficou mais perto do que escrevi, mas ainda acrescentou decisões de design. **Qual eu usaria neste projeto:** o TLC, porque o README do desafio tem muita ambiguidade em carrinho e pedido (visitante, refresh, taxa de rede), e as perguntas que ele levanta são o tipo de lacuna que custaria caro descobrir só na hora de implementar. O custo é ter mais critérios para revisar, então eu precisaria cortar o que não tem origem no README.
