# RESEARCH — Medo de pagar errado ou pagar duas vezes ao comprar um NFT

> Sessão de Research, não interativa. Nada aqui vem de entrevista. A fonte única é o enunciado do desafio (README), que faz o papel do dono do negócio. Tudo o que o colecionador "diz" é **reconstrução**, e todo número é **estimativa** com a origem declarada.

## Quem sente a dor

O **colecionador que está comprando** um NFT no marketplace: alguém que já escolheu o item e a edição, tem carteira cadastrada e está prestes a gastar dinheiro de verdade (na simulação, dinheiro simulado, mas a dor é a mesma).

Não é o visitante que só navega. A dor aparece depois que ele decidiu comprar. É também quem não tem como "desfazer" depois: o enunciado trata a compra como definitiva, porque pedido confirmado ou recusado é terminal.

## Em que momento ela aparece

Na etapa de **pagamento e confirmação**, do momento em que ele revisa o pedido até ver (ou não ver) a confirmação. Há quatro pontos concretos de aflição:

1. **Entre revisar e confirmar.** Ele viu um total, mas o preço, a disponibilidade de uma edição, o cupom ou a taxa de rede podem ter mudado nesse intervalo. Ele teme pagar um valor diferente do que aprovou.
2. **No clique de "comprar".** Nada acontece de imediato, ele clica de novo, ou a conexão cai e ele reenvia. Ele teme comprar duas vezes.
3. **Com o pedido pendente.** A conexão cai, a tela trava ou ele recarrega a página. Ele não sabe se o pedido existe, se foi pago ou se precisa tentar outra vez.
4. **Depois de uma falha ou recusa.** Ele quer saber se o carrinho continua como estava, e, depois de um sucesso, se saiu do carrinho só o que ele comprou.

Há ainda um momento posterior: **abrir o recibo** e conferir se os valores batem com o que ele aprovou, mesmo que o catálogo tenha mudado.

## O que essa pessoa diria, com as próprias palavras

**RECONSTRUÇÃO, não citação.** Ninguém foi entrevistado. As frases abaixo foram escritas a partir das situações descritas no enunciado, para dar voz à dor.

> "Eu vi 0,50 ETH na tela, aprovei, e na hora de pagar o valor era outro. Ninguém me avisou. Eu só descobri porque fui olhar de novo."

> "Cliquei em comprar, não deu nada, cliquei de novo. Agora eu não sei se comprei uma vez ou duas."

> "A internet caiu bem na hora. Recarreguei a página e sumiu tudo. Paguei? Não paguei? Se eu tentar de novo, vou pagar em dobro?"

> "Deu erro e eu perdi o que tinha no carrinho. Tive que escolher tudo de novo, e uma das edições já tinha acabado."

> "Comprei dois itens de cinco. Por que o carrinho esvaziou? Eu ainda queria os outros três."

> "Abri o recibo e o preço não é o que eu paguei. Qual é o verdadeiro?"

## O que isso custa hoje

**Não existe medição real.** O repositório não tem dados de uso, de reclamações, de chamados nem de transações. O que segue é estimativa, e a origem de cada ponto está indicada.

| Custo | O que é | Tamanho | Origem |
|---|---|---|---|
| **Dinheiro: pagar valor diferente do aprovado** | Diferença entre o total que ele aprovou e o que foi cobrado | Sem número. O prejuízo é a diferença em si, por compra afetada | Dedução do enunciado: ele exige revalidar preço, disponibilidade, cupom e taxas antes de confirmar |
| **Dinheiro: compra duplicada** | Pagar duas vezes o mesmo item, sem querer | Pode chegar a **100% do valor de um item** por ocorrência, e o item é único ou de edição limitada, então nem sempre há reembolso fácil | Estimativa por raciocínio (duas cobranças do mesmo valor). Não há dado de frequência |
| **Erro: perda de confiança** | Ele não sabe o estado do próprio pedido e desiste ou compra em outro lugar | Sem número | Hipótese. Não há taxa de abandono medida |
| **Tempo: refazer o carrinho** | Escolher de novo itens e edições após uma falha | Da ordem de **alguns minutos por ocorrência** (estimativa grosseira: 1 a 3 minutos por item refeito) | Estimativa minha, sem base empírica. Serve só para dar ordem de grandeza |
| **Tempo: investigar o que aconteceu** | Conferir em outro lugar se pagou, procurar ajuda | Da ordem de **dezenas de minutos**, mais a espera por resposta | Estimativa minha, sem base empírica |
| **Oportunidade: edição que acaba** | Enquanto ele refaz tudo, a edição esgota | Perda do item desejado | Dedução do enunciado: a disponibilidade muda ao vivo e há "edição indisponível" |

**Leitura honesta:** o custo mais grave não é o tempo. É o **erro com dinheiro** e a **dúvida sobre o estado do pedido**. Os dois são raros e caros, não frequentes e baratos. Por isso ninguém consegue dizer "quanto dói" sem medir, e o primeiro número que falta é a frequência com que cada situação acontece.

## O que já foi tentado (se algo foi)

**Nada está registrado.** O repositório não traz histórico de tentativas, de gambiarras nem de ferramentas anteriores.

Hipóteses de como um colecionador se defende hoje (**reconstruídas, não observadas**):

- Esperar bastante depois de clicar em comprar, por medo de clicar de novo.
- Ficar anotando à mão o valor que viu na tela, para comparar depois.
- Conferir a carteira por fora para saber se a cobrança saiu.
- Evitar comprar vários itens de uma vez, para limitar o estrago.

Essas defesas custam atenção e tempo ao colecionador e não removem o medo. Precisam ser confirmadas com colecionadores de verdade.

## Ligação com a semana 5

A dor vive no contexto **Pedido** (`src/pedido/`), onde o colecionador **compra**: carrinho, cotação, pagamento e confirmação.

A palavra que muda de sentido entre os contextos é **Preço**, e é por isso que a dor existe. No Catálogo o preço é vitrine e pode mudar a qualquer momento. No Pedido ele é o valor cotado, que vale para finalizar. O medo do colecionador nasce exatamente quando os dois sentidos se confundem.

O núcleo do projeto, já definido na semana 5, é o inverso da dor: o colecionador **nunca paga um valor diferente do que viu confirmado** e **nunca compra duas vezes sem querer**.

---

## Checklist de saída da sessão de Research

- [x] Não tem nenhuma palavra de solução técnica neste arquivo (nome de biblioteca, de dado técnico ou de ponto de acesso). Descreve só a dor.
- [x] Uma pessoa que não conhece o seu projeto consegue ler isto e entender o problema.
- [ ] Mostrar este arquivo a um colecionador real e ouvir "é isso mesmo". **Pendente:** as falas e os números são reconstrução e estimativa, e só essa validação os confirma.
