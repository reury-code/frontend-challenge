import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelaPagamento } from './pedido/TelaPagamento';

async function iniciar() {
  const { worker } = await import('./mocks/browser');
  await worker.start({ quiet: true });
  const queryClient = new QueryClient();
  createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <TelaPagamento />
    </QueryClientProvider>,
  );
}

iniciar();
