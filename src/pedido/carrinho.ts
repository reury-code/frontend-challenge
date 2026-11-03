import type { ItemCarrinho, NovoPedido } from './tipos';

/** Entrada do colecionador (não é resposta de API): 2 itens de 0,50 ETH. */
export const ITENS_CARRINHO: ItemCarrinho[] = [
  { nome: 'Item A', precoMilli: 500 },
  { nome: 'Item B', precoMilli: 500 },
];

export function montarPedido(itens: ItemCarrinho[]): NovoPedido {
  return { itens, totalMilli: itens.reduce((soma, i) => soma + i.precoMilli, 0) };
}

export function formatarEth(milli: number): string {
  return `${(milli / 1000).toFixed(2).replace('.', ',')} ETH`;
}
