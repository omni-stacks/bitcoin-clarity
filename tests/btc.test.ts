import { beforeEach, Context, decToHex, describe, it, run } from "../deps.ts";
import { BTCModel } from "../models/btc.model.ts";

let ctx: Context;
let btc: BTCModel;

beforeEach(() => {
  ctx = new Context();
  btc = ctx.models.get(BTCModel);
});

describe("[BTC]", () => {
  describe("buff-to-u8()", () => {
    it("returns correct value for hex numbers in range 0-255", () => {
      for (let i = 0; i <= 255; i++) {
        const response = btc.buffToU8(decToHex(i));
        response.expectUint(i);
      }
    });
  });

  describe("parse-tx()", () => {
    it("fails when passed empty tx", () => {
      const tx = "";

      // act
      const response = btc.parseTx(tx);

      // assert
      response.expectErr()
    })
  })
});

run();
