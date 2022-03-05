import { Account, Model, types } from "../deps.ts";

enum Err {}

export class BTCModel extends Model {
  name = "btc";

  static Err = Err;

  buffToU8(byte: string | ArrayBuffer) {
    return this.callReadOnly("buff-to-u8", [types.buff(byte)]).result;
  }
}
