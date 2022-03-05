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
      r.offset.expectUint(offset + 2);
      r.val.expectUint(53679);
    });

    it("succeeds and reads correct u32 value", () => {
      const data = "000000afd100FF00";
      const offset = 3;
      const base = 32;

      // act
      const result = btc.readUInt(data, offset, base);

      // assert
      const r = result.expectOk().expectTuple() as ReadUIntResult;
      r.offset.expectUint(offset + 4);
      r.val.expectUint(4278243759);
    });

    it("succeeds and reads correct u64 value", () => {
      const data = "0000ffffffffffffffff00";
      const offset = 2;
      const base = 64;

      // act
      const result = btc.readUInt(data, offset, base);

      // assert
      const r = result.expectOk().expectTuple() as ReadUIntResult;
      r.offset.expectUint(offset + 8);
      r.val.expectUint(BigInt("18446744073709551615"));
    });
  });

  describe("read-varint()", () => {
    it("succeeds and reads 1 byte values", () => {
      const testCases = [
        { data: "00", offset: 0, expectedVal: BigInt("0"), expectedOffset: 1 },
        { data: "00aa", offset: 1, expectedVal: BigInt("170"), expectedOffset: 2 },
        { data: "0000fa", offset: 2, expectedVal: BigInt("250"), expectedOffset: 3 },
        { data: "000000fc", offset: 3, expectedVal: BigInt("252"), expectedOffset: 4 },
      ];

      for(let t of testCases) {
        const result = btc.readVarInt(t.data, t.offset).expectOk().expectTuple() as ReadUIntResult;
        result.offset.expectUint(t.expectedOffset);
        result.val.expectUint(t.expectedVal);
      }
    });

    it("succeeds and reads 2 byte values", () => {
      const testCases = [
        { data: "fdaabb", offset: 0, expectedVal: BigInt("48042"), expectedOffset: 3 },
        { data: "00fd0001", offset: 1, expectedVal: BigInt("256"), expectedOffset: 4 },
        { data: "0000fdddfd", offset: 2, expectedVal: BigInt("64989"), expectedOffset: 5 },
        { data: "000000fdffff", offset: 3, expectedVal: BigInt("65535"), expectedOffset: 6 },
      ];

      for(let t of testCases) {
        const result = btc.readVarInt(t.data, t.offset).expectOk().expectTuple() as ReadUIntResult;
        result.offset.expectUint(t.expectedOffset);
        result.val.expectUint(t.expectedVal);
      }
    });

    it("succeeds and reads 4 byte values", () => {
      const testCases = [
        { data: "fe00000001", offset: 0, expectedVal: BigInt("16777216"), expectedOffset: 5 },
        { data: "00feaabbcc01", offset: 1, expectedVal: BigInt("30194602"), expectedOffset: 6 },
        { data: "0000fefefefefe", offset: 2, expectedVal: BigInt("4278124286"), expectedOffset: 7 },
        { data: "000000feffffffff", offset: 3, expectedVal: BigInt("4294967295"), expectedOffset: 8 },
      ];

      for(let t of testCases) {
        const result = btc.readVarInt(t.data, t.offset).expectOk().expectTuple() as ReadUIntResult;
        result.offset.expectUint(t.expectedOffset);
        result.val.expectUint(t.expectedVal);
      }
    });

    it("succeeds and reads 8 byte values", () => {
      const testCases = [
        { data: "ff0100000000000000", offset: 0, expectedVal: BigInt("1"), expectedOffset: 9 },
        { data: "00ffffaabbddaabbcc01", offset: 1, expectedVal: BigInt("129684831825799935"), expectedOffset: 10 },
        { data: "0000ff000105fafefefefe", offset: 2, expectedVal: BigInt("18374403900787982592"), expectedOffset: 11 },
        { data: "000000ffffffffffffffffff", offset: 3, expectedVal: BigInt("18446744073709551615"), expectedOffset: 12 },
      ];

      for(let t of testCases) {
        const result = btc.readVarInt(t.data, t.offset).expectOk().expectTuple() as ReadUIntResult;
        result.offset.expectUint(t.expectedOffset);
        result.val.expectUint(t.expectedVal);
      }
    });
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
