import { test, expect } from '@playwright/test';

test.describe('TIMELOOP AI – 3D Virtual World & System Diagnostics', () => {
  test('3D Virtual World renders WebGL canvas, HUD, and era controls', async ({ page }) => {
    await page.goto('/virtual-world');

    // Verify Title & Diagnostics
    await expect(page.locator('h1')).toContainText('3D Immersive Reality Matrix');
    await expect(page.locator('text=WebGL 3D Engine Active')).toBeVisible();

    // Verify Era Switcher Buttons
    await expect(page.locator('button:has-text("Cyberpunk 2099")')).toBeVisible();
    await expect(page.locator('button:has-text("Deep Space")')).toBeVisible();
    await expect(page.locator('button:has-text("Ancient India")')).toBeVisible();

    // Verify Graphics Quality Switcher
    await expect(page.locator('button:has-text("LOW")')).toBeVisible();
    await expect(page.locator('button:has-text("ULTRA")')).toBeVisible();

    // Verify Story Objective Panel
    await expect(page.locator('text=Active Timeline Mission')).toBeVisible();

    // Verify Voice Narration Button
    await expect(page.locator('button:has-text("Play Loud Scene Narration")')).toBeVisible();
  });

  test('System Diagnostics Page renders real 7-subsystem status panel', async ({ page }) => {
    await page.goto('/profile');

    await expect(page.locator('h1')).toContainText('System Status & Engine Diagnostics');
    await expect(page.locator('h3:has-text("Next.js Core Application Backend")')).toBeVisible();
    await expect(page.locator('h3:has-text("NVIDIA NIM Inference Engine")')).toBeVisible();
    await expect(page.locator('h3:has-text("Persistence & Timeline Store")')).toBeVisible();
    await expect(page.locator('h3:has-text("Internal Model Context Protocol (MCP) Server")')).toBeVisible();
    await expect(page.locator('h3:has-text("Three.js WebGL 3D Virtual World Engine")')).toBeVisible();
  });

  test('India Heritage History & Voice Explorer renders photo gallery, voice guide, and then-and-now comparison', async ({ page }) => {
    await page.goto('/heritage');

    // Verify Title & Heritage Hub Header
    await expect(page.locator('h1')).toContainText('INDIA HERITAGE HISTORY & VOICE EXPLORER');

    // Verify State Filter & Monument Selection
    await expect(page.locator('h2:has-text("Heritage Sites")')).toBeVisible();
    await expect(page.locator('h2:has-text("The Taj Mahal")')).toBeVisible();

    // Verify Authentic Photographic Archives
    await expect(page.locator('text=Authentic Photographic Archives')).toBeVisible();

    // Verify Then & Now Historical Visual Comparison
    await expect(page.locator('text=Then & Now — Historical Visual Comparison')).toBeVisible();

    // Verify AI Voice History Guide & Primary CTA Button
    await expect(page.locator('text=AI Voice History Guide')).toBeVisible();
    await expect(page.locator('button:has-text("सूनिये पूरा इतिहास (Hindi)")')).toBeVisible();

    // Verify Deep History Tabs
    await expect(page.locator('button:has-text("Historical Chronicles")')).toBeVisible();
    await expect(page.locator('button:has-text("Architecture & Engineering")')).toBeVisible();
    await expect(page.locator('button:has-text("Chronological Timeline")')).toBeVisible();
    await expect(page.locator('button:has-text("Lesser-Known Facts & Secrets")')).toBeVisible();

    // Verify Interactive AI History Guide Chat
    await expect(page.locator('text=Interactive AI History Guide')).toBeVisible();
    await expect(page.locator('button:has-text("Poochhein")')).toBeVisible();
  });

  test('India Heritage Explorer switches monuments and renders complete historical dossier', async ({ page }) => {
    await page.goto('/heritage');

    // Switch to Golden Temple
    await page.fill('input[placeholder*="Search 47 Indian monuments"]', 'Golden Temple');
    await page.click('h3:has-text("The Golden Temple")');

    // Verify Golden Temple Header & Details
    await expect(page.locator('h2:has-text("The Golden Temple")')).toBeVisible();
    await expect(page.locator('text=Amritsar, Punjab').first()).toBeVisible();
    await expect(page.locator('span:has-text("Sri Harmandir Sahib")').first()).toBeVisible();
  });
});
