import { describe, it, expect, vi } from "vitest";
import { getPackageInfo, getRuntimeInfo, formatStatus } from "../../src/utils/file.helper.js";

describe("getPackageInfo", () => {
  it("returns name and version", () => {
    const info = getPackageInfo();
    expect(info).toHaveProperty("name");
    expect(info).toHaveProperty("version");
  });
});

describe("getRuntimeInfo", () => {
  it("returns node and uptime", () => {
    const runtime = getRuntimeInfo();
    expect(typeof runtime.node).toBe("string");
    expect(typeof runtime.uptime).toBe("number");
  });

  it("calls process.uptime()", () => {
    const spy = vi.spyOn(process, "uptime");
    getRuntimeInfo();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("formatStatus", () => {
  it("throws on negative", () => {
    expect(() => formatStatus(-1)).toThrow("invalid uptime");
  });
  it("warming-up under 60s", () => {
    expect(formatStatus(10)).toBe("warming-up");
  });
  it("healthy under 1h", () => {
    expect(formatStatus(3599)).toBe("healthy");
  });
  it("steady at or after 1h", () => {
    expect(formatStatus(3600)).toBe("steady");
  });
});
