import { delay, http, HttpResponse } from 'msw';

/**
 * API de pedidos simulada. O "banco" vive em localStorage para sobreviver a
 * recarregamentos da página (a simulação roda na página, que perde memória ao recarregar).
 *
 * Cenário escolhido por ?cenario= na URL da página (padrão: normal):
 *  - normal:   responde em ~200 ms com pedido confirmado
 *  - lento:    responde em 3 s com pedido confirmado
 *  - pendente: responde em ~200 ms com pedido pendente (nunca confirma)
 *  - queda:    na 1ª requisição de cada chave, o servidor cria o pedido mas a
 *              resposta não chega (demora 12 s, além do timeout do cliente);
 *              as seguintes respondem normalmente
 *
 * Idempotência: a mesma chave recupera o mesmo pedido; mesma chave com
 * conteúdo diferente responde 409.
 */
type Cenario = 'normal' | 'lento' | 'pendente' | 'queda';

interface PedidoMock {
  id: string;
  chave: string;
  totalMilli: number;
  estado: 'pendente' | 'confirmado' | 'recusado';
  conteudo: string;
}
interface Requisicao {
  chave: string;
  em: number;
}

const K_PEDIDOS = 'mock:pedidos';
const K_REQ = 'mock:requisicoes';

function ler<T>(chave: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(chave) ?? '[]') as T[];
  } catch {
    return [];
  }
}
function gravar(chave: string, valor: unknown) {
  localStorage.setItem(chave, JSON.stringify(valor));
}
function cenarioAtual(): Cenario {
  const c = new URLSearchParams(location.search).get('cenario');
  return c === 'lento' || c === 'pendente' || c === 'queda' ? c : 'normal';
}
function publico(p: PedidoMock) {
  const { conteudo: _conteudo, ...resto } = p;
  return resto;
}

export const handlers = [
  http.post('/api/pedidos', async ({ request }) => {
    const chave = request.headers.get('Idempotency-Key');
    if (!chave) return HttpResponse.json({ erro: 'Idempotency-Key obrigatória' }, { status: 400 });

    const corpo = (await request.json()) as { itens: unknown; totalMilli: number };
    const conteudo = JSON.stringify(corpo);
    const cenario = cenarioAtual();

    const requisicoes = ler<Requisicao>(K_REQ);
    const primeiraDaChave = !requisicoes.some((r) => r.chave === chave);
    gravar(K_REQ, [...requisicoes, { chave, em: Date.now() }]);

    const pedidos = ler<PedidoMock>(K_PEDIDOS);
    let pedido = pedidos.find((p) => p.chave === chave);

    if (pedido && pedido.conteudo !== conteudo) {
      return HttpResponse.json({ erro: 'Chave já usada com conteúdo diferente' }, { status: 409 });
    }
    if (!pedido) {
      pedido = {
        id: crypto.randomUUID(),
        chave,
        totalMilli: corpo.totalMilli,
        estado: cenario === 'pendente' ? 'pendente' : 'confirmado',
        conteudo,
      };
      gravar(K_PEDIDOS, [...pedidos, pedido]);
    }

    if (cenario === 'lento') await delay(3000);
    else if (cenario === 'queda' && primeiraDaChave) await delay(12_000);
    else await delay(200);

    return HttpResponse.json(publico(pedido), { status: 200 });
  }),

  // Observação para os testes: o que o "servidor" realmente criou e recebeu.
  http.get('/api/mock/pedidos', () =>
    HttpResponse.json({
      pedidos: ler<PedidoMock>(K_PEDIDOS).map(publico),
      requisicoes: ler<Requisicao>(K_REQ),
    }),
  ),
];
