const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Flattens Tailwind's @layer output into plain CSS — cascade layers
    // (Chromium 99+, 2022) aren't supported on older embedded browsers
    // (e.g. cheap smart TVs), which drop the entire @layer block, wiping
    // out ALL styling instead of degrading gracefully.
    "@csstools/postcss-cascade-layers": {},
  },
};

export default config;
