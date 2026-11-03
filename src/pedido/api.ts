import axios, { AxiosError } from 'axios';
import type { NovoPedido, Pedido } from './tipos';

export const TEMPO_ESPERA_MS = 10_000;
export const MAX_REENVIOS = 3;

const http = axios.create({ baseURL: '/api', timeout: TEMPO_ESPERA_MS });

async function enviarUmaVez(pedido: NovoPedido, chave: string): Promise<Pedido> {
  const { data } = await http.post<Pedido>('/pedidos', pedido, {
    headers: { 'Idempotency-Key': chave },
  });
  return data;
}

function falhaDeConexao(erro: unknown): boolean {
  return erro instanceof AxiosError && !erro.response;
}

/**
 * Envia o pedido com a chave dada. Em queda de conexão ou timeout (10 s),
 * reenvia com a MESMA chave, no máximo MAX_REENVIOS vezes. Nunca gera chave nova.
 */
export async function enviarPedido(pedido: NovoPedido, chave: string): Promise<Pedido> {
  let ultimoErro: unknown;
  for (let tentativa = 0; tentativa <= MAX_REENVIOS; tentativa++) {
    try {
      return await enviarUmaVez(pedido, chave);
    } catch (erro) {
      if (!falhaDeConexao(erro)) throw erro;
      ultimoErro = erro;
    }
  }
  throw ultimoErro;
}
