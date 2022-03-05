import { Account } from "https://deno.land/x/clarinet@v0.27.0/index.ts";

export { Chain, Clarinet, Tx, types } from "https://deno.land/x/clarinet@v0.27.0/index.ts";

export type { Account } from "https://deno.land/x/clarinet@v0.27.0/index.ts";

export { assertEquals } from "https://deno.land/std@0.125.0/testing/asserts.ts";

export {
  describe,
  it,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  test,
  run,
} from "https://deno.land/x/dspec@v0.2.0/mod.ts";

export { Context } from "./lib/utils/context.ts";
export { Model, Models } from "./lib/utils/model.ts";

export type Accounts = Map<string, Account>;

import { encode as hexEncode, decode as hexDecode } from "https://deno.land/std@0.125.0/encoding/hex.ts";

export function stringToHex(input: string) {
  return hexDecode(new TextEncoder().encode(input))
}

export function decToHex(input: number) {
  let v = input.toString(16);
  v = v.length > 1 ? v : `0${v}`;

  return stringToHex(v)
}
