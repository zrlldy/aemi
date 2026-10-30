import { expect, test } from '@playwright/test';

for (const [width, height] of [[320, 740], [375, 667], [390, 844], [430, 932]]) {
 test(`mobile hero fits at ${width}px and menu keeps keyboard access`, async ({ page }) => {
  await page.setViewportSize({ width, height });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('http://localhost:3001');
  await expect(page.locator('.lanyard-canvas')).toBeVisible();
  const geometry = await page.evaluate(() => {
   const card = document.querySelector('.identity')!.getBoundingClientRect();
   const heading = document.querySelector('h1')!.getBoundingClientRect();
   const action = document.querySelector('.primary')!.getBoundingClientRect();
   return { cardBottom: card.bottom, headingRight: heading.right, actionHeight: action.height, overflow: document.documentElement.scrollWidth > innerWidth };
  });
  expect(geometry.cardBottom).toBeLessThanOrEqual(height - 20);
  expect(geometry.headingRight).toBeLessThan(width);
  expect(geometry.actionHeight).toBeGreaterThanOrEqual(44);
  expect(geometry.overflow).toBe(false);
  const flip = await page.getByRole('button', { name: 'Flip identity card' }).boundingBox();
  expect(flip!.y + flip!.height).toBeLessThanOrEqual(height - 20);
  expect(flip!.height).toBeGreaterThanOrEqual(44);

  const dock=page.getByRole('navigation',{name:'Main navigation'});
  const link=dock.getByRole('link',{name:'Work',exact:true});await link.focus();await expect(link).toBeFocused();
  const dockBox=await dock.boundingBox();expect(dockBox!.x).toBeGreaterThanOrEqual(0);expect(dockBox!.x+dockBox!.width).toBeLessThanOrEqual(width);
  const galleryHeading = await page.locator('.motion-heading h3').boundingBox();
  expect(galleryHeading!.height).toBeLessThan(50);
 });
}
