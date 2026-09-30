import { test, expect } from "@playwright/test";
test("learning topics filter and the finite library continues as labeled revisits", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s begin" }).click();
  await expect(page.getByRole("button", { name: "Let’s begin" })).toBeHidden();
  await page.getByRole("tab", { name: "Learn", exact: true }).click();
  await page.getByRole("button", { name: "Comfort", exact: true }).click();
  await expect(
    page.getByText("A little warmth can help.", { exact: true }),
  ).toBeVisible();
  await page.getByTestId("learning-feed").hover();
  await expect
    .poll(
      async () => {
        await page.mouse.wheel(0, 1200);
        return page.getByText(/Revisit/).count();
      },
      { timeout: 15000, intervals: [300, 500, 1000] },
    )
    .toBeGreaterThan(0);
  await page.getByRole("button", { name: "Show saved posts" }).click();
  await expect(
    page.getByText("A little space for your favourites.", { exact: true }),
  ).toBeVisible();
});
test("period history, estimates, journals, bookmarks, profiles and deletion survive real use", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s begin" }).click();
  await expect(page.getByRole("button", { name: "Let’s begin" })).toBeHidden();
  await page.getByRole("tab", { name: "Cycle", exact: true }).click();
  for (const [start, end] of [
    ["2026-06-01", "2026-06-05"],
    ["2026-06-29", "2026-07-03"],
    ["2026-07-27", "2026-07-31"],
  ]) {
    await page.getByRole("button", { name: "Log period", exact: true }).click();
    await page.getByLabel("Start date", { exact: true }).fill(start);
    await page.getByLabel("End date", { exact: true }).fill(end);
    await page
      .getByRole("button", { name: "Save period", exact: true })
      .click();
  }
  await expect(
    page.getByText("Your personal estimate", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Aug 24, 2026", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Log period", exact: true }).click();
  await page.getByLabel("Start date", { exact: true }).fill("2026-06-03");
  await page.getByLabel("End date", { exact: true }).fill("2026-06-05");
  await page.getByRole("button", { name: "Save period", exact: true }).click();
  await expect(page.getByText(/These dates overlap/)).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Discard changes" }).click();
  await page.getByRole("tab", { name: "Journal", exact: true }).click();
  await page.getByRole("button", { name: "Write a reflection" }).click();
  await page
    .getByRole("textbox", { name: "Title (optional)", exact: true })
    .fill("A quiet afternoon");
  await page
    .getByRole("textbox", { name: "Your thoughts", exact: true })
    .fill("I made time for a walk and felt peaceful.");
  await page.getByRole("button", { name: "Hopeful", exact: true }).click();
  await page
    .getByRole("button", { name: "Save reflection", exact: true })
    .click();
  await expect(
    page.getByText("A quiet afternoon", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("tab", { name: "Journal", exact: true }).click();
  await expect(
    page.getByText("A quiet afternoon", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Open journal: A quiet afternoon" })
    .click();
  await page
    .getByRole("textbox", { name: "Your thoughts", exact: true })
    .fill("Updated reflection.");
  await page
    .getByRole("button", { name: "Save reflection", exact: true })
    .click();
  await expect(
    page.getByText("Updated reflection.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Learn", exact: true }).click();
  await page
    .getByRole("button", { name: "Save post", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Show saved posts" }).click();
  await expect(page.getByText("1 / 1", { exact: true })).toBeVisible();
  await page.getByRole("tab", { name: "World", exact: true }).click();
  await page
    .getByRole("button", { name: "Read about Malala Yousafzai" })
    .click();
  await expect(
    page.getByText("2014 · Nobel Peace Prize", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close profile" }).click();
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("button", { name: "Privacy & your data", exact: true })
    .click();
  await expect(
    page.getByText("3 periods · 1 reflections · 1 saved posts", {
      exact: true,
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete all personal data", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Delete all my data", exact: true })
    .click();
  await page.reload();
  await page.getByRole("tab", { name: "Journal", exact: true }).click();
  await expect(
    page.getByText("A fresh page awaits.", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("all screens render on mobile and wide browser sizes", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s begin" }).click();
  await expect(page.getByRole("button", { name: "Let’s begin" })).toBeHidden();
  for (const tab of ["Home", "Cycle", "Learn", "Journal", "World"]) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
    await page.screenshot({
      path: `test-results/${tab.toLowerCase()}-mobile.png`,
    });
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.getByRole("tab", { name: "Home", exact: true }).click();
  await page.screenshot({ path: "test-results/home-desktop.png" });
});
