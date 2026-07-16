import { describe, expect, it, vi, beforeEach } from "vitest";
import { ApiError, apiFetch, configureApiClient } from "../src/api/client.js";

describe("apiFetch", () => {
  beforeEach(() => {
    configureApiClient({ apiBase: "/api", auth0Domain: "", auth0ClientId: "", auth0Audience: "", authReturnTo: "", redirectUri: "" });
  });

  it("parses JSON success responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true }),
    }));
    await expect(apiFetch("/health")).resolves.toEqual({ ok: true });
  });

  it("throws ApiError on failure with JSON body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: "unauthorized", message: "Missing token" }),
    }));
    await expect(apiFetch("/account")).rejects.toBeInstanceOf(ApiError);
  });
});
