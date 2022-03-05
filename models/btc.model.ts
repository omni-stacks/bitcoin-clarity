import { Account, Model, stringToHex, types } from "../deps.ts";

enum Err {
  ERR_INVALID_TX = 1000,
  ERR_INVALID_BASE = 1001,
}

export class BTCModel extends Model {
  name = "btc";

  static Err = Err;

  buffToU8(byte: string | ArrayBuffer) {
    return this.callReadOnly("buff-to-u8", [types.buff(byte)]).result;
  }

  parseTx(tx: string | ArrayBuffer) {
    return this.callReadOnly("parse-tx", [
      types.buff(typeof tx === "string" ? stringToHex(tx) : tx),
    ]).result;
  }

  readUInt(
    data: string | ArrayBuffer,
    offset: number | bigint,
    base: number | bigint
  ) {
    return this.callReadOnly("read-uint", [
      types.buff(typeof data === "string" ? stringToHex(data) : data),
      types.uint(offset),
      types.int(base),
    ]).result;
  }

  readVarInt(data: string | ArrayBuffer, offset: number | bigint) {
    return this.callReadOnly("read-varint", [
      types.buff(typeof data === "string" ? stringToHex(data) : data),
      types.uint(offset),
    ]).result;
  }
}

export interface ReadUIntResult {
  offset: string;
  val: string;
}
