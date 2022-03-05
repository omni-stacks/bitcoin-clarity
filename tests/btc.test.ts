import { beforeEach, Context, decToHex, describe, it, run } from "../deps.ts";
import { BTCModel, ReadUIntResult } from "../models/btc.model.ts";

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

  describe("read-uint()", () => {
    it("fails for base different than 16, 32 and 64", () => {
      const data = "000000000000000000000001";
      const offset = 0;
      const testBases = [15, 17, 31, 33, 63, 65];

      for (let base of testBases) {
        const result = btc.readUInt(data, offset, base);
        result.expectErr().expectUint(BTCModel.Err.ERR_INVALID_BASE);
      }
    });

    it("succeeds and reads correct u16 value", () => {
      const data = "000000afd1000000";
      const offset = 3;
      const base = 16;

      // act
      const result = btc.readUInt(data, offset, base);

      // assert
      const r = result.expectOk().expectTuple() as ReadUIntResult;
      r.offset.expectUint(offset + 2)
      r.val.expectUint(53679)
    });

    it("succeeds and reads correct u32 value", () => {
      const data = "000000afd100FF00";
      const offset = 3;
      const base = 32;

      // act
      const result = btc.readUInt(data, offset, base);

      // assert
      const r = result.expectOk().expectTuple() as ReadUIntResult;
      r.offset.expectUint(offset + 4)
      r.val.expectUint(4278243759)
    });

    it("succeeds and reads correct u64 value", () => {
      const data = "0000ffffffffffffffff00";
      const offset = 2;
      const base = 64;

      // act
      const result = btc.readUInt(data, offset, base);

      // assert
      const r = result.expectOk().expectTuple() as ReadUIntResult;
      r.offset.expectUint(offset + 8)
      r.val.expectUint(BigInt("18446744073709551615"))
    })
  });

  describe("parse-tx()", () => {
    it("fails when passed empty tx", () => {
      const tx = "";

      // act
      const response = btc.parseTx(tx);

      // assert
      response.expectErr();
    });
  });
});

run();
