import { beforeEach, afterEach, vi } from "vitest";

let consoleErrorSpy;
let consoleLogSpy;
let consoleWarnSpy;

beforeEach(() => {
  consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy?.mockRestore();
  consoleLogSpy?.mockRestore();
  consoleWarnSpy?.mockRestore();
});
