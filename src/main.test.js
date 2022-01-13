import { bar } from "./foomodule.js";

test("foo", () => {
  expect(bar(1)).toEqual(1);
});
