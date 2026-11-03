import type { PedidoLocal } from './tipos';

const CHAVE_STORAGE = 'pedido-local';

export function lerPedidoLocal(): PedidoLocal | null {
  try {
    const bruto = localStorage.getItem(CHAVE_STORAGE);
    return bruto ? (JSON.parse(bruto) as PedidoLocal) : null;
  } catch {
    return null;
  }
}

export function salvarPedidoLocal(pedido: PedidoLocal | null): void {
  try {
    if (pedido) localStorage.setItem(CHAVE_STORAGE, JSON.stringify(pedido));
    else localStorage.removeItem(CHAVE_STORAGE);
  } catch {
    /* sem armazenamento: segue sem persistir */
  }
}
