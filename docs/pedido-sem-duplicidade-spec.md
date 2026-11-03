# Pedido sem duplicidade — spec

**Bounded context (semana 5):** Pedido (`src/pedido/`)
**ADR relacionada:** [`docs/adr/0001-pedido-sem-duplicidade.md`](adr/0001-pedido-sem-duplicidade.md)
**Escala:** M — cruza confiança com o colecionador e envolve dinheiro, mas o recorte é uma única dor

## Contexto

O colecionador já escolheu o item e a edição e está prestes a pagar. Ele clica em "comprar", nada acontece de imediato e ele clica de novo; ou a conexão cai e ele reenvia. A frase que resume a dor (reconstrução, não citação): "Cliquei em comprar, não deu nada, cliquei de novo. Agora eu não sei se comprei uma vez ou duas." Compra duplicada pode chegar a 100% do valor de um item por ocorrência (estimativa, sem dado de frequência), e como pedido confirmado ou recusado é terminal, ele não consegue desfazer. Nada disto foi validado com colecionador real.

## Decisão

Todo **Pedido** é enviado com uma **chave de idempotência** criada uma vez por intenção de compra e reutilizada em qualquer reenvio. Enquanto um envio estiver em andamento ou o pedido estiver pendente, o sistema não aceita novo envio. Detalhes e alternativas descartadas estão na ADR-0001.

## Fora de escopo

- Pagar valor diferente do aprovado (revalidação da **Cotação**).
- Perda ou esvaziamento indevido do **Carrinho** após falha ou sucesso parcial.
- Conferência do recibo contra o **Pedido** aprovado.
- Edição que esgota enquanto o colecionador refaz a compra.
- Reembolso ou estorno de uma compra que já tenha sido duplicada.
- Os números abaixo (1 segundo, 10 segundos, 3 reenvios) são valores de trabalho escolhidos para tornar os critérios testáveis. O RESEARCH.md não os fornece; confirmar na semana 8.

## Critérios (EARS)

1. **(Ubíqua)** O sistema deve associar cada **Pedido** a exatamente 1 chave de idempotência, criada no momento em que o colecionador confirma a compra.
2. **(Orientada a evento)** Quando o colecionador confirmar a compra, o sistema deve enviar o **Pedido** com a sua chave e não aceitar outro envio dessa intenção até receber uma resposta ou esgotar o tempo de espera de 10 segundos.
3. **(Orientada a estado)** Enquanto houver um **Pedido** pendente para uma chave, o sistema deve ignorar qualquer novo clique de comprar sobre a mesma intenção e mostrar ao colecionador que o pedido está pendente.
4. **(Feature opcional)** Onde existir um **Pedido** pendente guardado no aparelho após o colecionador recarregar a página, o sistema deve retomar esse pedido com a mesma chave, sem criar um novo.
5. **(Comportamento indesejado)** Se o envio falhar por queda de conexão ou esgotar os 10 segundos sem resposta, então o sistema deve reenviar o **Pedido** com a mesma chave, no máximo 3 vezes, e nunca gerar uma chave nova.

### Origem de cada critério (revisão)

| # | Frase do RESEARCH.md | Seção do README |
|---|---|---|
| 1 | "Agora eu não sei se comprei uma vez ou duas." | §3 "Pagamento e confirmação": "Impedir pedidos duplicados"; §5 "Pedidos": criação idempotente |
| 2 | "Cliquei em comprar, não deu nada, cliquei de novo." | §3 "Pagamento e confirmação": "cliques repetidos" |
| 3 | "Paguei? Não paguei?" (pedido pendente) | §3 "Pagamento e confirmação": "Representar pedido pendente, confirmado e recusado"; §7 "interrupção de conexão enquanto o pedido está pendente" |
| 4 | "Recarreguei a página e sumiu tudo." | §3 "Pagamento e confirmação": "recuperação após refresh ou reconexão"; §7 "recuperar seu estado sem criar outra compra" |
| 5 | "A internet caiu bem na hora... vou pagar em dobro?" | §3 "Pagamento e confirmação": "reenvios após timeout"; §5: "a mesma tentativa deve recuperar o mesmo pedido" |

Os números 10 segundos, 3 reenvios e 1 segundo não vêm do RESEARCH.md nem do README. São valores de trabalho, já marcados em "Fora de escopo".

## Cenários (BDD)

```gherkin
Cenário: Clique repetido em "comprar" gera um único pedido
Dado que o colecionador tem 2 itens de 0,50 ETH no carrinho, com total cotado de 1,00 ETH
E ele confirmou a compra e o pedido está sendo enviado com a chave K1
Quando ele clica em "comprar" mais 1 vez, 1 segundo depois
Então existe apenas 1 pedido, com a chave K1
E o total do pedido é 1,00 ETH, e não 2,00 ETH

Cenário: Timeout no pagamento e reenvio não duplicam o pedido (erro)
Dado que o colecionador confirmou a compra e o pedido foi enviado com a chave K2
E a conexão caiu e passaram 10 segundos sem resposta
Quando o sistema reenvia o pedido
Então o reenvio usa a mesma chave K2
E, ao voltar a conexão, existe apenas 1 pedido com a chave K2
E o colecionador vê o estado desse pedido, e não uma mensagem de "tente de novo"

Cenário: Recarregar a página com pedido pendente não cria outro pedido (limite)
Dado que o colecionador tem um pedido pendente com a chave K3
Quando ele recarrega a página e clica em "comprar" 1 vez
Então o sistema retoma o pedido da chave K3 e mostra que ele está pendente
E nenhum pedido novo é criado
```

## Como eu vou saber que funcionou

Ainda não há implementação nem comando de teste definido. Os 3 cenários acima viram testes na semana 8, e o critério de pronto é: todos passam e, em cada um, o número de pedidos criados é 1. Falta também a validação pendente do RESEARCH.md: mostrar a dor a um colecionador real.

## Linguagem ubíqua usada aqui

| Termo | O que significa neste projeto |
|---|---|
| Carrinho | A lista de itens que o colecionador pretende comprar, mantida após refresh. |
| Cotação | A resposta da API com cupom, disponibilidade, descontos, taxa de rede e total; é a referência para finalizar o pedido. |
| Pedido | A compra enviada para confirmação, com estado pendente, confirmado ou recusado, identificado por uma chave de idempotência para nunca duplicar. |
| Chave de idempotência | O identificador único de uma intenção de compra; todo reenvio da mesma intenção usa a mesma chave, para que ela nunca vire dois pedidos. |
| Preço | No contexto Pedido, o valor cotado e congelado que vale para finalizar a compra. |
