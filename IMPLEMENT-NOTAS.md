# Dúvidas e leituras conservadoras

1. **"Não aceitar novo envio" na UI:** a spec não diz se o botão fica desabilitado ou apenas ignora o clique. O critério 3 diz "ignorar qualquer novo clique", então o botão continua clicável e o clique é ignorado pelo hook; o estado pendente é exibido.
2. **Reenvios esgotados (critério 5):** a spec não diz o que mostrar após 3 reenvios sem resposta. Leitura conservadora: o pedido continua guardado como pendente (mesma chave), com aviso "sem resposta"; não há nova chave nem mensagem de "tente de novo". Ele é retomado na próxima recarga.
3. **Total de tentativas:** "no máximo 3 reenvios" lido como 1 envio inicial + até 3 reenvios (4 requisições no máximo).
4. **Falhas reenviáveis:** só queda de conexão e timeout (sem resposta HTTP) são reenviados. Respostas HTTP (ex.: 409) não são reenviadas.
5. **Cenário 2 (reenvio):** a spec diz "10 segundos sem resposta, então o sistema reenvia". O teste espera os 10 s reais do cliente; o mock simula a queda fazendo o servidor criar o pedido mas demorar 12 s a responder (cenário `?cenario=queda`).
6. **Cenário 3 e "retomar":** a retomada ao recarregar é feita reenviando o pedido pendente com a mesma chave (idempotente), não consultando por GET (a spec não define endpoint de consulta). O mock em `pendente` nunca confirma, o que o torna estável para o teste.
7. **Itens do carrinho:** o carrinho (2 itens de 0,50 ETH) é uma constante de entrada em `src/pedido/carrinho.ts`, pois o Carrinho está fora do escopo; a Cotação não é simulada, apenas o total calculado dos itens.
8. **Estado do mock:** guardado em localStorage da página (contexto isolado por teste) para sobreviver a recarga; não é um servidor real.
9. **Pedido terminal:** após confirmado/recusado o pedido deixa de ser guardado como pendente; uma nova compra cria nova chave. A regra de "comprar o mesmo item de novo" está indecisa na ADR.
