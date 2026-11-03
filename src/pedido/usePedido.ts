import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { enviarPedido } from './api';
import { lerPedidoLocal, salvarPedidoLocal } from './armazenamento';
import { ITENS_CARRINHO, montarPedido } from './carrinho';
import type { PedidoLocal } from './tipos';

export function usePedido() {
  const [pedido, setPedido] = useState<PedidoLocal | null>(() => lerPedidoLocal());
  const emAndamento = useRef(false);

  const atualizar = useCallback((novo: PedidoLocal) => {
    setPedido(novo);
    salvarPedidoLocal(novo.estado === 'pendente' ? novo : null);
  }, []);

  const mutation = useMutation({
    mutationFn: ({ chave }: { chave: string }) => enviarPedido(montarPedido(ITENS_CARRINHO), chave),
    onSuccess: (resposta) =>
      atualizar({ chave: resposta.chave, totalMilli: resposta.totalMilli, estado: resposta.estado }),
    onError: (_erro, { chave }) =>
      atualizar({
        chave,
        totalMilli: montarPedido(ITENS_CARRINHO).totalMilli,
        estado: 'pendente',
        semResposta: true,
      }),
    onSettled: () => {
      emAndamento.current = false;
    },
  });

  const enviar = useCallback(
    (chave: string) => {
      emAndamento.current = true;
      mutation.mutate({ chave });
    },
    [mutation],
  );

  // Critério 4: pedido pendente guardado -> retoma com a mesma chave.
  const retomou = useRef(false);
  useEffect(() => {
    if (retomou.current) return;
    retomou.current = true;
    const guardado = lerPedidoLocal();
    if (guardado && guardado.estado === 'pendente') enviar(guardado.chave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const comprar = useCallback(() => {
    // Critérios 2 e 3: envio em andamento ou pedido pendente -> ignora o clique.
    if (emAndamento.current || pedido?.estado === 'pendente') return;
    // Critério 1: uma chave por intenção, criada na confirmação.
    const chave = crypto.randomUUID();
    atualizar({ chave, totalMilli: montarPedido(ITENS_CARRINHO).totalMilli, estado: 'pendente' });
    enviar(chave);
  }, [pedido, atualizar, enviar]);

  return { pedido, comprar, enviando: mutation.isPending };
}
