import { expect, test } from "@playwright/test";

test("creates a note", async ({ page }) => {
  await page.route("**/api/notes", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({ json: { id: 1, body: "Test the stack", createdAt: "2026-09-27 10:30:00" }, status: 201 });
      return;
    }
    await route.fulfill({ json: [] });
  });

  await page.goto("/");
  await page.getByLabel("New note").fill("Test the stack");
  await page.getByRole("button", { name: "Add note" }).click();

  await expect(page.getByText("Test the stack")).toBeVisible();
});
