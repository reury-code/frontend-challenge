export type EstadoPedido = 'pendente' | 'confirmado' | 'recusado';

export interface ItemCarrinho {
  nome: string;
  /** Preço em milésimos de ETH (500 = 0,500 ETH), inteiro para evitar erro de ponto flutuante. */
  precoMilli: number;
}

export interface NovoPedido {
  itens: ItemCarrinho[];
  totalMilli: number;
}

export interface Pedido {
  id: string;
  chave: string;
  totalMilli: number;
  estado: EstadoPedido;
}

/** Pedido guardado no aparelho: a chave sobrevive à recarga da página. */
export interface PedidoLocal {
  chave: string;
  totalMilli: number;
  estado: EstadoPedido;
  /** true quando os reenvios se esgotaram sem resposta. */
  semResposta?: boolean;
}
