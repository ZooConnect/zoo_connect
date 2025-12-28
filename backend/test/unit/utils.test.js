import { describe, it, expect, vi } from "vitest";
import Utils from "../../src/utils/Utils.js";

describe("getPackageInfo", () => {
  it("returns name and version", () => {
    const info = Utils.getPackageInfo();
    expect(info).toHaveProperty("name");
    expect(info).toHaveProperty("version");
  });
});

describe("getRuntimeInfo", () => {
  it("returns node and uptime", () => {
    const runtime = Utils.getRuntimeInfo();
    expect(typeof runtime.node).toBe("string");
    expect(typeof runtime.uptime).toBe("number");
  });

  it("calls process.uptime()", () => {
    const spy = vi.spyOn(process, "uptime");
    Utils.getRuntimeInfo();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("formatStatus", () => {
  it("throws on negative", () => {
    expect(() => Utils.formatStatus(-1)).toThrow("invalid uptime");
  });
  it("warming-up under 60s", () => {
    expect(Utils.formatStatus(10)).toBe("warming-up");
  });
  it("healthy under 1h", () => {
    expect(Utils.formatStatus(3599)).toBe("healthy");
  });
  it("steady at or after 1h", () => {
    expect(Utils.formatStatus(3600)).toBe("steady");
  });
});
