import { Account, Model, stringToHex, types } from "../deps.ts";

enum Err {
  ERR_INVALID_TX = 1000
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
}
