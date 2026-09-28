import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

vi.mock("@/i18n/LanguageContext", () => ({
  useLanguage: () => ({
    t: (text: string) => text,
    language: "DE",
    setLanguage: vi.fn(),
  }),
}));

import Hero from "./Hero";

describe("Hero carousel", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("renders exactly the three configured hero images", () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    const images = Array.from(container.querySelectorAll("img"));
    expect(images).toHaveLength(3);
    expect(images[0].getAttribute("src")).toContain("/hero-wide.jpg");
    expect(images[1].getAttribute("src")).toBe("/tour-kultur.jpg");
    expect(images[2].getAttribute("alt")).toContain("Holzmoschee in Karakol");
  });

  test("changes hero image every 8 seconds", () => {
    vi.useFakeTimers();

    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    const slides = Array.from(
      container.querySelectorAll('[aria-hidden]'),
    );

    expect(slides[0].getAttribute("aria-hidden")).toBe("false");

    vi.advanceTimersByTime(7999);
    expect(slides[0].getAttribute("aria-hidden")).toBe("false");

    vi.advanceTimersByTime(1);
    expect(slides[0].getAttribute("aria-hidden")).toBe("true");
    expect(slides[1].getAttribute("aria-hidden")).toBe("false");
  });

  test("uses a 4-second opacity transition", () => {
    const { container } = render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    const slide = container.querySelector('[aria-hidden="false"]');
    expect(slide?.className).toContain("duration-[4000ms]");
  });
});
