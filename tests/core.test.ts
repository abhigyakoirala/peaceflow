import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addDays,
  daysBetween,
  dayNumber,
  validatePeriod,
  prediction,
  emptyData,
  parseData,
  Period,
} from "../src/core";
import { posts, women } from "../src/content";
const p = (start: string, end = start, id = start): Period => ({
  id,
  start,
  end,
  flow: "Medium",
  symptoms: [],
});
test("calendar arithmetic handles leap years and daylight saving independently of time zone", () => {
  assert.equal(addDays("2024-02-28", 1), "2024-02-29");
  assert.equal(addDays("2025-12-31", 1), "2026-01-01");
  assert.equal(daysBetween("2026-03-07", "2026-03-09"), 2);
  assert.throws(() => dayNumber("2025-02-29"));
  assert.throws(() => dayNumber("2026-13-01"));
});
test("rejects future dates, reverse ranges and overlaps but allows editing the same record", () => {
  assert.match(validatePeriod(p("2026-10-01"), [], "2026-09-30")!, /Future/);
  assert.match(validatePeriod(p("2026-09-05", "2026-09-01"), [])!, /end date/);
  assert.match(
    validatePeriod(p("2026-09-04", "2026-09-08"), [
      p("2026-09-01", "2026-09-05"),
    ])!,
    /overlap/,
  );
  assert.equal(
    validatePeriod(p("2026-09-01", "2026-09-06"), [
      p("2026-09-01", "2026-09-05"),
    ]),
    null,
  );
  assert.equal(validatePeriod(p("2026-09-01", "2026-09-21"), []), null);
});
test("does not invent predictions for insufficient history", () => {
  assert.equal(prediction([]).next, null);
  assert.equal(prediction([p("2026-08-01"), p("2026-08-29")]).next, null);
});
test("uses sorted start-to-start intervals and median of up to six intervals", () => {
  const result = prediction(
    [p("2026-03-01"), p("2026-01-01"), p("2026-01-30")],
    "2026-03-10",
  );
  assert.equal(result.typical, 30);
  assert.equal(result.next, "2026-03-31");
  assert.equal(result.cycleDay, 10);
  assert.deepEqual(result.range, ["2026-03-30", "2026-03-31"]);
});
test("never rolls a missed period estimate forward as if a period occurred", () => {
  const result = prediction(
    [p("2026-01-01"), p("2026-01-29"), p("2026-02-26")],
    "2026-09-30",
  );
  assert.equal(result.next, "2026-03-26");
  assert.match(result.reason, /passed/);
});
test("wide variation is explicit rather than silently excluding data", () => {
  const result = prediction([
    p("2026-01-01"),
    p("2026-02-01"),
    p("2026-08-01"),
  ]);
  assert.equal(result.next, null);
  assert.match(result.reason, /vary widely/);
});
test("invalid persisted data fails instead of resetting user records", () => {
  assert.deepEqual(parseData(JSON.stringify(emptyData())), emptyData());
  assert.throws(() => parseData("{broken"));
  assert.throws(() =>
    parseData(JSON.stringify({ ...emptyData(), periods: [p("2026-02-30")] })),
  );
  assert.throws(() =>
    parseData(JSON.stringify({ ...emptyData(), entries: [{ body: 42 }] })),
  );
});
test("50 original posts and five sourced profiles ship offline", () => {
  assert.equal(posts.length, 50);
  assert.equal(new Set(posts.map((p) => p.id)).size, 50);
  assert.equal(new Set(posts.map((p) => p.title)).size, 50);
  assert.equal(women.length, 5);
  assert.ok(women.every((w) => w.url.startsWith("https://")));
  assert.ok(
    posts.every(
      (p) =>
        p.body &&
        p.source &&
        (p.url.startsWith("https://") || p.category === "Reflection"),
    ),
  );
});
