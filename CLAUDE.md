# CLAUDE.md

Projeto: Desafio Frontend (Marketplace de NFTs). O README.md é o enunciado.

# Glossário: Marketplace de NFTs (Desafio Frontend)

Fonte única: o `README.md` do desafio, que faz o papel do dono do negócio. Cada termo cita a seção de onde veio.

## Contexto 1: Catálogo (pasta: src/catalogo/)

Onde o colecionador **descobre** NFTs: início, busca, filtros, detalhe e favoritos.

- **NFT**: o item único à venda no marketplace, com galeria, informações e edições; é o que o colecionador procura e abre no detalhe. (README §3 "Detalhes do NFT"; §3 "Catálogo e detalhe")
- **Edição**: a variação numerada de um NFT que pode ser comprada, cada uma com sua própria quantidade disponível; o detalhe precisa tratar "edição indisponível". (§3 "Catálogo e detalhe"; §3 "Carrinho": "disponibilidade por NFT e edição")
- **Disponibilidade**: quantas unidades de uma edição ainda podem ser compradas segundo a última informação da API; muda ao vivo por `nft.updated`. (§3 "Carrinho"; §7 tabela de eventos)

## Contexto 2: Pedido (pasta: src/pedido/)

Onde o colecionador **compra**: carrinho, cotação, pagamento e confirmação.

- **Carrinho**: a lista de itens que o colecionador pretende comprar, mantida após refresh e preservada do visitante ao autenticar. (§3 "Carrinho")
- **Cotação**: a resposta da API com cupom, disponibilidade, descontos, taxa de rede e total; "é a referência para finalizar o pedido". (§3 depois de "Carrinho"; §5 tabela "Cotação")
- **Pedido**: a compra enviada para confirmação, com estado pendente, confirmado ou recusado, e identificado por uma chave de idempotência para nunca duplicar. (§3 "Pagamento e confirmação"; §5 "Pedidos"; §5 "chave de idempotência")

## Palavra que muda de sentido entre os dois

- **Preço**: no **Catálogo** é o valor de vitrine do NFT, que pode mudar a qualquer momento por evento ao vivo e só informa; no **Pedido** é o valor **cotado e congelado** que vale para finalizar a compra e que, depois de confirmada, fica fixo no recibo mesmo que o catálogo mude. (§3 "Pagamento e confirmação": "O recibo deve reproduzir o snapshot do pedido. Alterações posteriores no catálogo não podem modificar seus valores"; §7 "Seu preço ou disponibilidade muda durante a navegação")

(Disponibilidade também deriva: no Catálogo informa, no Pedido pode virar conflito. Escolhi Preço como a palavra principal por ter dois sentidos formais no README.)

## Núcleo do projeto

Uma compra de NFT em que o colecionador **nunca paga um valor diferente do que viu confirmado** e **nunca compra duas vezes sem querer**: cotação sempre revalidada, pedido idempotente e recibo imutável. (§3 "Pagamento e confirmação"; §7)
