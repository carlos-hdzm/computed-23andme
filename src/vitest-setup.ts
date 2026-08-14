import { locators } from "vitest/browser";

locators.extend({
  getByClassName(className: string) {
    return `.${className}`;
  },
});
