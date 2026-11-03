# ADR-0001: Identificar cada pedido por uma chave de idempotência para nunca gerar dois pedidos

## Status

Proposta

## Contexto

O colecionador que já decidiu comprar clica em "comprar", nada acontece de imediato, e ele clica de novo; ou a conexão cai e ele reenvia. Em suas palavras (reconstrução, não citação): "Agora eu não sei se comprei uma vez ou duas." Uma compra duplicada pode custar até 100% do valor de um item por ocorrência (estimativa por raciocínio, sem dado de frequência), e o item é único ou de edição limitada, então nem sempre há reembolso fácil. Pedido confirmado ou recusado é terminal, então não há como desfazer depois. Esta decisão cobre só a duplicidade por clique repetido ou reenvio após falha/timeout; as outras dores do RESEARCH.md ficam fora (ver spec).

## Decisão

Cada **Pedido** nasce com uma **chave de idempotência** única, criada uma vez por intenção de compra e reutilizada em todo reenvio dessa mesma intenção. Enquanto houver um envio em andamento ou um pedido pendente para essa chave, nenhum novo envio é feito.

## Alternativas consideradas

- **Só desabilitar o botão após o clique:** cobre o clique repetido, mas não o reenvio após queda de conexão nem após recarregar a página. Descartada por cobrir só metade da dor.
- **Gerar uma chave nova a cada tentativa:** cada reenvio pareceria uma compra nova e criaria o duplicado que queremos evitar. Descartada.

## Consequências

**Positivas:**
- O colecionador pode clicar de novo ou reenviar sem medo: a mesma intenção nunca vira dois pedidos.
- A chave é o que liga uma tentativa à outra, então o estado de um pedido pendente pode ser retomado em vez de recomeçado.

**Negativas / trade-offs:**
- A chave precisa sobreviver a falha e a recarregamento da página, o que exige guardá-la junto do pedido pendente.
- Depende de a API tratar a mesma chave como o mesmo pedido; esta ADR não confirma esse comportamento além do que o enunciado diz sobre a chave.
- Quando o colecionador de fato quer comprar o mesmo item de novo, é preciso uma intenção nova (chave nova); a regra para isso não está decidida aqui.
