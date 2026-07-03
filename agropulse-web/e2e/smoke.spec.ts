import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke tests E2E — flujos críticos de AgroPulse.
 *
 * Diseñados para NO depender de datos de Supabase remoto:
 * son read-mostly y usan el catálogo estático + cuentas demo del seed.
 * Si una precondición falla (p.ej. backend de auth caído), el test se
 * salta (test.skip) en lugar de fallar, para evitar flakiness.
 */

/**
 * Pre-siembra localStorage ANTES de cargar la app para:
 * - saltar el modal de selección de país (agropulse:country)
 * - saltar el banner de cookies (agropulse:consent)
 */
async function seedStorage(page: Page, country: string = "CR") {
  await page.addInitScript((c) => {
    window.localStorage.setItem(
      "agropulse:country",
      JSON.stringify({ state: { country: c, hasSelected: true }, version: 0 }),
    );
    window.localStorage.setItem(
      "agropulse:consent",
      JSON.stringify({
        state: {
          decided: true,
          categories: { essential: true, analytics: true, marketing: true },
        },
        version: 0,
      }),
    );
  }, country);
}

test.describe("Smoke — AgroPulse", () => {
  test("1. Landing carga con hero y badge Costa Rica", async ({ page }) => {
    await seedStorage(page);
    await page.goto("/");

    await expect(page).toHaveTitle(/AgroPulse/);

    // Hero principal
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    await expect(h1).toContainText("El pulso");

    // Badge de origen Costa Rica (aparece en hero y marquee → first)
    await expect(
      page.getByText("Hecho en Costa Rica · Pura Vida AgriTech").first(),
    ).toBeVisible();
  });

  test("2. Marketplace muestra cards y las tabs de país funcionan", async ({
    page,
  }) => {
    // Arrancamos en México para verificar que el cambio a Costa Rica funciona
    await seedStorage(page, "MX");
    await page.goto("/marketplace");

    // Grid con cards de producto (cada card tiene link "Ver lote →")
    await expect(
      page.getByRole("link", { name: /Ver lote/ }).first(),
    ).toBeVisible();
    await expect(page.getByText(/en México/).first()).toBeVisible();

    // Click tab Costa Rica → productos CR (retry por hidratación)
    const crTab = page
      .locator("main")
      .getByRole("button", { name: "Costa Rica", exact: true });
    await expect(crTab).toBeVisible();
    await expect(async () => {
      await crTab.click();
      await expect(page.getByText(/en Costa Rica/).first()).toBeVisible({
        timeout: 2_000,
      });
    }).toPass({ timeout: 20_000 });
    await expect(
      page.getByRole("link", { name: /Ver lote/ }).first(),
    ).toBeVisible();
  });

  test("3. Detalle de producto muestra precio y botón", async ({ page }) => {
    await seedStorage(page);
    await page.goto("/marketplace");

    const firstLot = page.getByRole("link", { name: /Ver lote/ }).first();
    await expect(firstLot).toBeVisible();
    await firstLot.click();

    // Página de detalle: /marketplace/<id>
    await page.waitForURL(/\/marketplace\/.+/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Precio por unidad ("por kg", "por caja", etc.)
    await expect(page.getByText(/^por /).first()).toBeVisible();

    // Al menos un botón de acción (agregar al carrito o gate de login)
    await expect(page.locator("main").getByRole("button").first()).toBeVisible();
  });

  test("4. Login demo cliente precarga credenciales y crea sesión", async ({
    page,
  }) => {
    await seedStorage(page);
    await page.goto("/login");

    // Precargar cuenta demo cliente con el botón "Probar".
    // Se reintenta el click hasta que la hidratación de React registre
    // el handler (antes de hidratar, el click no hace nada).
    const probar = page.getByRole("button", { name: /maria@cliente\.cr/ });
    await expect(probar).toBeVisible();
    await expect(async () => {
      await probar.click();
      await expect(page.locator("#email")).toHaveValue("maria@cliente.cr", {
        timeout: 1_000,
      });
    }).toPass({ timeout: 20_000 });
    await expect(page.locator("#password")).not.toHaveValue("");

    await page
      .getByRole("button", { name: "Iniciar sesión", exact: true })
      .click();

    // O redirige fuera de /login (cliente → /pedidos vía guard del
    // dashboard), o muestra error de backend en el form (→ skip).
    // OJO: el alert se busca DENTRO del form para no matchear el
    // route-announcer de Next.js (también role="alert").
    const redirected = page
      .waitForURL((url) => !url.pathname.startsWith("/login"), {
        timeout: 30_000,
      })
      .then(() => "ok" as const)
      .catch(() => "timeout" as const);
    const errored = page
      .locator("form[aria-label='Iniciar sesión']")
      .getByRole("alert")
      .waitFor({ state: "visible", timeout: 30_000 })
      .then(() => "error" as const)
      .catch(() => "timeout" as const);
    const result = await Promise.race([redirected, errored]);

    test.skip(
      result !== "ok",
      "Backend de autenticación no disponible en este entorno",
    );

    // Verificar sesión activa: la navbar muestra el menú de usuario (avatar)
    await page.goto("/");
    await expect(
      page.locator("header button[aria-haspopup='menu']"),
    ).toBeVisible({ timeout: 20_000 });
  });

  test("5. Planes: selector de moneda y toggle anual funcionan", async ({
    page,
  }) => {
    await seedStorage(page);
    await page.goto("/planes");

    // Moneda por defecto USD (sin sesión)
    const currencyBtn = page.getByRole("button", { name: /Cambiar moneda/ });
    await expect(currencyBtn).toBeVisible();
    await expect(currencyBtn).toContainText("USD");

    // Primer precio (plan Básico) en dólares
    const firstPrice = page.locator("span.text-4xl").first();
    await expect(firstPrice).toContainText("$");

    // Cambiar a colones (CRC) — retry por hidratación del dropdown
    await expect(async () => {
      await currencyBtn.click();
      await page.getByRole("option", { name: /CRC/ }).click({ timeout: 2_000 });
    }).toPass({ timeout: 20_000 });
    await expect(firstPrice).toContainText("₡", { timeout: 10_000 });

    // Toggle anual → aparece el badge de ahorro por plan ("Ahorras N%")
    const anualTab = page.getByRole("tab", { name: "Anual", exact: true });
    await expect(async () => {
      await anualTab.click();
      await expect(page.getByText(/Ahorras \d+%/).first()).toBeVisible({
        timeout: 2_000,
      });
    }).toPass({ timeout: 20_000 });
  });

  test("6. Casos de éxito: cards y filtro por país", async ({ page }) => {
    await seedStorage(page);
    await page.goto("/casos-de-exito");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Casos de éxito",
    );

    // Cards visibles (articles)
    const cards = page.locator("article");
    await expect(cards.first()).toBeVisible();
    const totalBefore = await cards.count();
    expect(totalBefore).toBeGreaterThan(0);

    // Filtro por país: Costa Rica (retry por hidratación)
    const filterGroup = page.getByRole("group", {
      name: "Filtrar casos de éxito por país",
    });
    const crFilter = filterGroup.getByRole("button", { name: /Costa Rica/ });
    await expect(crFilter).toBeVisible();
    await expect(async () => {
      await crFilter.click();
      await expect(cards.first()).toContainText("Costa Rica", {
        timeout: 2_000,
      });
    }).toPass({ timeout: 20_000 });
  });

  test("7. Pedido inexistente sin sesión redirige a login", async ({
    page,
  }) => {
    await seedStorage(page);
    await page.goto("/pedidos/pedido-inexistente");

    // Sin sesión → redirect a /login?from=/pedidos/pedido-inexistente
    await page.waitForURL(/\/login/, { timeout: 30_000 });
    await expect(
      page.getByRole("heading", { name: "Bienvenido de vuelta" }),
    ).toBeVisible();
  });
});
