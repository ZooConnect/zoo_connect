
import { describe, it, expect } from "vitest";
import { buildEventFilter } from "../../src/utils/events.js";

describe("buildEventFilter", () => {
  it("default includes active events with end_date >= now", () => {
    const now = new Date("2025-12-01T12:00:00Z");
    const filter = buildEventFilter({}, now);
    expect(filter).toEqual({ status: "active", end_date: { $gte: now } });
  });

  it("adds type when provided", () => {
    const filter = buildEventFilter({ type: "concert" });
    expect(filter.type).toBe("concert");
  });

  it("adds date overlap constraints", () => {
    const filter = buildEventFilter({ date: "2025-12-20" });
    expect(filter.start_date.$lte instanceof Date).toBe(true);
    expect(filter.end_date.$gte instanceof Date).toBe(true);
  });
});
