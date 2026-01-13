import { test, expect, FrameLocator } from "@playwright/test";

/**
 * Integration tests for shell-app message exchange via postMessage API.
 * Tests the communication flow between the shell host application and
 * the embedded app running in an iframe.
 */
test.describe("Shell-App Message Exchange", () => {
  let appFrame: FrameLocator;

  test.beforeEach(async ({ page }) => {
    // Navigate to the shell application
    await page.goto("/");

    // Get the app iframe
    appFrame = page.frameLocator('[data-testid="app-iframe"]');

    // Wait for both shell and app to be connected
    await expect(
      page.locator('[data-testid="shell-status"][data-status="connected"]')
    ).toBeVisible({ timeout: 10000 });

    await expect(
      appFrame.locator('[data-testid="app-status"][data-status="connected"]')
    ).toBeVisible({ timeout: 10000 });
  });

  test("should establish connection between shell and app", async ({
    page,
  }) => {
    // Verify shell shows "Connected" status
    await expect(page.getByText("Connected")).toBeVisible();

    // Verify app inside iframe also shows "Connected" status
    await expect(appFrame.getByText("Connected")).toBeVisible();
  });

  test("should send message from shell to app", async ({ page }) => {
    const testMessage = "Hello from Shell!";

    // Type message in shell input
    await page.locator('[data-testid="shell-input"]').fill(testMessage);

    // Click send button
    await page.locator('[data-testid="shell-send-button"]').click();

    // Verify message appears in shell's message list
    const shellMessage = page.locator('[data-testid="shell-message-shell"]');
    await expect(shellMessage).toContainText(testMessage);

    // Verify message is received in app's message list (from shell)
    const appReceivedMessage = appFrame.locator(
      '[data-testid="app-message-shell"]'
    );
    await expect(appReceivedMessage).toContainText(testMessage);
  });

  test("should send message from app to shell", async ({ page }) => {
    const testMessage = "Hello from App!";

    // Type message in app input (inside iframe)
    await appFrame.locator('[data-testid="app-input"]').fill(testMessage);

    // Click send button in app
    await appFrame.locator('[data-testid="app-send-button"]').click();

    // Verify message appears in app's message list
    const appMessage = appFrame.locator('[data-testid="app-message-app"]');
    await expect(appMessage).toContainText(testMessage);

    // Verify message is received in shell's message list (from app)
    const shellReceivedMessage = page.locator(
      '[data-testid="shell-message-app"]'
    );
    await expect(shellReceivedMessage).toContainText(testMessage);
  });

  test("should have bidirectional message exchange", async ({ page }) => {
    // Send message from shell to app
    const shellMessage = "Message 1 from Shell";
    await page.locator('[data-testid="shell-input"]').fill(shellMessage);
    await page.locator('[data-testid="shell-send-button"]').click();

    // Verify message received in app
    await expect(
      appFrame.locator('[data-testid="app-message-shell"]')
    ).toContainText(shellMessage);

    // Send reply from app to shell
    const appReply = "Reply from App";
    await appFrame.locator('[data-testid="app-input"]').fill(appReply);
    await appFrame.locator('[data-testid="app-send-button"]').click();

    // Verify reply received in shell
    await expect(
      page.locator('[data-testid="shell-message-app"]')
    ).toContainText(appReply);

    // Verify message history in shell (should have both messages)
    const shellMessages = page.locator('[data-testid="shell-messages"]');
    await expect(shellMessages).toContainText(shellMessage);
    await expect(shellMessages).toContainText(appReply);

    // Verify message history in app (should have both messages)
    const appMessages = appFrame.locator('[data-testid="app-messages"]');
    await expect(appMessages).toContainText(shellMessage);
    await expect(appMessages).toContainText(appReply);
  });

  test("should send message using Enter key", async ({ page }) => {
    const testMessage = "Enter key test";

    // Type message and press Enter in shell
    await page.locator('[data-testid="shell-input"]').fill(testMessage);
    await page.locator('[data-testid="shell-input"]').press("Enter");

    // Verify message was sent
    await expect(
      page.locator('[data-testid="shell-message-shell"]')
    ).toContainText(testMessage);

    // Verify message received in app
    await expect(
      appFrame.locator('[data-testid="app-message-shell"]')
    ).toContainText(testMessage);
  });
});
