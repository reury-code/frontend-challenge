# REVIEW: sessão de Plan (semana 6)

Problema: clique repetido ou reenvio após timeout no pagamento não pode gerar dois pedidos (README §3 "Pagamento e confirmação", §5 "Pedidos"). Escala M. Contexto: Pedido.

## O que pedi na sessão de Plan

Uma sessão nova, que recebeu **só** o conteúdo do `RESEARCH.md`, o nome do contexto (Pedido), 4 termos do glossário e o recorte do problema (só duplicidade; as outras dores do Research ficaram fora). Pedi a ADR e o documento enxuto com 5 critérios EARS (um de cada padrão) e 3 cenários BDD, sem código.

## O que o agente devolveu

- `docs/adr/0001-pedido-sem-duplicidade.md`: decisão de dar a cada Pedido uma chave de idempotência criada uma vez por intenção de compra, com duas alternativas descartadas.
- `docs/pedido-sem-duplicidade-spec.md`: 5 critérios EARS e 3 cenários BDD (clique repetido, timeout com reenvio, recarregar com pedido pendente), com números concretos.
- O agente avisou sozinho que 1 s, 10 s e 3 reenvios eram valores de trabalho dele, que o critério 4 era leitura dele e que a regra de "comprar o mesmo item de novo" ficou em aberto.

## O que eu rejeitei ou reescrevi

1. **EARS 2, reescrito.** O agente escreveu "desabilitar o botão de comprar". Isso é decisão de interface, não comportamento, e o README não pede. Troquei por "não aceitar outro envio dessa intenção até receber uma resposta ou esgotar o tempo". Efeito visível na Sessão 3: a implementação ficou com "ignorar o clique" em vez de botão desabilitado (dúvida nº 1 em `IMPLEMENT-NOTAS.md`).
2. **Origem de cada critério.** Acrescentei à spec uma tabela ligando cada EARS a uma frase do `RESEARCH.md` e a uma seção do README. Todos os 5 passaram: nenhum ficou sem origem. O critério 4 ("pedido pendente guardado no aparelho") era o mais fraco, mas se apoia em "Recarreguei a página" (Research) e em §3 ("recuperação após refresh ou reconexão").
3. **Números sem origem.** 10 s, 3 reenvios e 1 s não existem no Research nem no README. Mantive, mas deixei marcados em "Fora de escopo" como valores de trabalho a confirmar, para não passarem por fato.
4. **BDD.** Conferi que há cenários de erro e de limite, não só o caminho feliz: o 2 (timeout) e o 3 (recarregar com pedido pendente).

## O que não foi revisado ou ficou aberto

- O Research **não foi interativo** nem validado com um colecionador real: as falas são reconstrução e os custos são estimativa. O último item do checklist de saída do Research está desmarcado de propósito.
- A sessão de Research e a de Plan rodaram como sessões separadas do agente (cada uma recebendo só o artefato anterior). A de Implement rodou num subagente de contexto limpo, porque a primeira tentativa não pôde executar comandos de shell e, corretamente, não escreveu nada.
- A regra para o colecionador comprar o mesmo item de novo continua em aberto (ADR, consequências negativas).
- O mock guarda seu estado no `localStorage` da página (dúvida nº 8), o que é uma limitação do ambiente de testes.

## Resultado da implementação

`npx tsc --noEmit` sem erros e `npx playwright test`: 3 passaram, 0 falharam (Chromium), cada um observando a interface e o mock. A primeira rodada do agente teve 2 falhas, corrigidas no código sem alterar os testes.
