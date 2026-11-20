import { test, expect } from '@playwright/test';

test.describe('TIMELOOP AI – Complete User Journey', () => {
  test('traveler end-to-end journey from landing to story decision and poster', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page.locator('h1')).toContainText("Don't Just Watch History");

    // 2. Navigation to Eras Catalog
    await page.click('text=Explore Time Eras');
    await expect(page).toHaveURL('/eras');
    await expect(page.locator('text=Explore 8 Verified Time Eras')).toBeVisible();

    // 3. Inspect Era Details (Ancient India)
    await page.click('text=Ancient India');
    await expect(page).toHaveURL(/.*\/eras\/ancient-india/);
    await expect(page.locator('text=World-Building & Cultural Landscape')).toBeVisible();

    // 4. Character Studio
    await page.goto('/character-studio');
    await expect(page.locator('h1')).toContainText('AI Character Studio');

    // 5. Story Configuration
    await page.goto('/story-config');
    await expect(page.locator('h1')).toContainText('Configure Your Adventure');

    // 6. Launch Story
    await page.click('text=Initiate Interactive Odyssey');
    await expect(page).toHaveURL(/.*\/story-player\/.*/);

    // 7. Verify Story Player & Choice interaction
    await expect(page.locator('text=Choose Your Timeline Branch')).toBeVisible();
    const firstChoice = page.locator('button:has-text("Path 1")');
    if (await firstChoice.isVisible()) {
      await firstChoice.click();
    }

    // 8. What If Universe
    await page.goto('/what-if');
    await expect(page.locator('h1')).toContainText('The What If Universe');

    // 9. Movie Poster Studio
    await page.goto('/poster-studio');
    await expect(page.locator('h1')).toContainText('AI Movie Poster Studio');
    await expect(page.locator('text=Download Poster (High Res)')).toBeVisible();

    // 10. Voice Studio
    await page.goto('/voice-studio');
    await expect(page.locator('h1')).toContainText('Chrono-Voice Studio');

    // 11. Personal Library
    await page.goto('/library');
    await expect(page.locator('h1')).toContainText('My Personal Chronos Library');
  });
});
