import { ITENS_CARRINHO, formatarEth, montarPedido } from './carrinho';
import { usePedido } from './usePedido';

export function TelaPagamento() {
  const { pedido, comprar } = usePedido();

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 420, margin: '2rem auto' }}>
      <h1>Pagamento</h1>
      <ul>
        {ITENS_CARRINHO.map((i) => (
          <li key={i.nome}>
            {i.nome}: {formatarEth(i.precoMilli)}
          </li>
        ))}
      </ul>
      <p>Total cotado: {formatarEth(montarPedido(ITENS_CARRINHO).totalMilli)}</p>
      <button type="button" onClick={comprar}>
        Comprar
      </button>
      {pedido && (
        <section data-testid="estado-pedido" aria-live="polite">
          <p>
            Estado do pedido: <strong data-testid="estado">{pedido.estado}</strong>
          </p>
          <p>
            Chave: <code data-testid="chave">{pedido.chave}</code>
          </p>
          <p>
            Total do pedido: <span data-testid="total">{formatarEth(pedido.totalMilli)}</span>
          </p>
          {pedido.semResposta && <p>Sem resposta do servidor; o pedido segue pendente.</p>}
        </section>
      )}
    </main>
  );
}
