const { test, expect } = require('@playwright/test');
const path = require('path');

const STUDENT_FILE = process.env.STUDENT_FILE;

test.beforeAll(() => {
  if (!STUDENT_FILE) throw new Error('STUDENT_FILE 環境変数が設定されていません');
});

function resolveFileUrl() {
  return `file://${path.resolve(__dirname, '..', STUDENT_FILE)}`;
}

test('calcChange 関数がグローバルに定義され、正しい値を返す', async ({ page }) => {
  await page.goto(resolveFileUrl());

  const fnType = await page.evaluate(() => typeof window.calcChange);
  expect(fnType, 'calcChange がグローバル関数として定義されていません').toBe('function');

  // 商品合計は HTML 側で value="180" に固定されている前提
  // calcChange(payment) は payment - 180 を返す
  expect(await page.evaluate(() => window.calcChange(200))).toBe(20);
  expect(await page.evaluate(() => window.calcChange(500))).toBe(320);
  expect(await page.evaluate(() => window.calcChange(1000))).toBe(820);
});

test('ボタンクリックで .result に「お釣りは〇〇円です」が表示される', async ({ page }) => {
  await page.goto(resolveFileUrl());

  // 支払い 200円 → お釣り 20円
  await page.fill('#payment', '200');
  await page.click('button');
  await expect(page.locator('.result')).toContainText('お釣りは20円です');

  // 支払い 500円 → お釣り 320円
  await page.fill('#payment', '500');
  await page.click('button');
  await expect(page.locator('.result')).toContainText('お釣りは320円です');

  // 支払い 1000円 → お釣り 820円
  await page.fill('#payment', '1000');
  await page.click('button');
  await expect(page.locator('.result')).toContainText('お釣りは820円です');
});
