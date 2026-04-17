const { test, expect } = require('@playwright/test');
const path = require('path');

test('ボタンクリックで氏名・学校名・電話番号が表示される', async ({ page }) => {
  const studentFile = process.env.STUDENT_FILE;
  if (!studentFile) throw new Error('STUDENT_FILE 環境変数が設定されていません');

  const filePath = `file://${path.resolve(__dirname, '..', studentFile)}`;
  await page.goto(filePath);

  await page.click('button');

  // .result 内に ul が存在すること
  const ul = page.locator('.result ul');
  await expect(ul).toBeVisible({ timeout: 3000 });

  // li が 3 つあること
  const items = page.locator('.result ul li');
  await expect(items).toHaveCount(3);

  // 各入力値がいずれかの li に含まれていること
  const texts = await items.allTextContents();
  const joined = texts.join('\n');

  expect(joined).toContain('十来 電人');
  expect(joined).toContain('トライデントコンピュータ専門学校');
  expect(joined).toContain('052-581-0581');
});
