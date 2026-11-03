import { expect, test, type Page } from '@playwright/test';

interface Observacao {
  pedidos: { chave: string; totalMilli: number; estado: string }[];
  requisicoes: { chave: string }[];
}

async function observarMock(page: Page): Promise<Observacao> {
  return page.evaluate(async () => (await fetch('/api/mock/pedidos')).json());
}

async function abrir(page: Page, cenario: string) {
  await page.goto(`/?cenario=${cenario}`);
  await expect(page.getByRole('button', { name: 'Comprar' })).toBeVisible();
}

test('Clique repetido em "comprar" gera um único pedido', async ({ page }) => {
  await abrir(page, 'lento');
  await expect(page.getByText('Total cotado: 1,00 ETH')).toBeVisible();

  await page.getByRole('button', { name: 'Comprar' }).click();
  await expect(page.getByTestId('estado')).toHaveText('pendente');
  const k1 = await page.getByTestId('chave').innerText();

  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Comprar' }).click();

  await expect(page.getByTestId('estado')).toHaveText('confirmado', { timeout: 8000 });
  const obs = await observarMock(page);
  expect(obs.pedidos).toHaveLength(1);
  expect(obs.pedidos[0].chave).toBe(k1);
  expect(obs.pedidos[0].totalMilli).toBe(1000);
  expect(obs.requisicoes).toHaveLength(1);
  await expect(page.getByTestId('total')).toHaveText('1,00 ETH');
});

test('Timeout no pagamento e reenvio não duplicam o pedido', async ({ page }) => {
  await abrir(page, 'queda');

  await page.getByRole('button', { name: 'Comprar' }).click();
  await expect(page.getByTestId('estado')).toHaveText('pendente');
  const k2 = await page.getByTestId('chave').innerText();

  // Após ~10 s sem resposta o cliente reenvia; a 2ª resposta chega e confirma.
  await expect(page.getByTestId('estado')).toHaveText('confirmado', { timeout: 20_000 });
  await expect(page.getByTestId('chave')).toHaveText(k2);
  await expect(page.getByText(/tente de novo|tente novamente/i)).toHaveCount(0);

  const obs = await observarMock(page);
  expect(obs.pedidos).toHaveLength(1);
  expect(obs.pedidos[0].chave).toBe(k2);
  expect(obs.requisicoes.length).toBeGreaterThanOrEqual(2);
  expect(obs.requisicoes.every((r) => r.chave === k2)).toBe(true);
});

test('Recarregar a página com pedido pendente não cria outro pedido', async ({ page }) => {
  await abrir(page, 'pendente');

  await page.getByRole('button', { name: 'Comprar' }).click();
  await expect(page.getByTestId('estado')).toHaveText('pendente');
  const k3 = await page.getByTestId('chave').innerText();
  expect((await observarMock(page)).pedidos).toHaveLength(1);

  await page.reload();
  await expect(page.getByRole('button', { name: 'Comprar' })).toBeVisible();
  await page.getByRole('button', { name: 'Comprar' }).click();

  await expect(page.getByTestId('estado')).toHaveText('pendente');
  await expect(page.getByTestId('chave')).toHaveText(k3);
  await page.waitForTimeout(500);
  const obs = await observarMock(page);
  expect(obs.pedidos).toHaveLength(1);
  expect(obs.pedidos[0].chave).toBe(k3);
  expect(obs.requisicoes.every((r) => r.chave === k3)).toBe(true);
});
