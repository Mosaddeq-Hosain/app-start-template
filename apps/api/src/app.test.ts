import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("API metadata", () => {
  it("reports its health", async () => {
    const response = await app.request("/api/health");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "ok", database: "connected" });
  });

  it("publishes the notes OpenAPI operations", async () => {
    const response = await app.request("/openapi.json");
    const document = await response.json() as { paths: Record<string, unknown> };

    expect(document.paths).toHaveProperty("/api/notes");
  });
});
