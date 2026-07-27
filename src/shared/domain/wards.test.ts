import assert from "node:assert/strict";
import test from "node:test";

import { ADJACENT_WARDS, WARD_OPTIONS } from "./wards.ts";

test("横浜市18区が重複なく定義されている", () => {
  assert.equal(WARD_OPTIONS.length, 18);
  assert.equal(new Set(WARD_OPTIONS.map(({ value }) => value)).size, 18);
});
test("隣接区の関係は対称で自己参照を含まない", () => {
  for (const ward of WARD_OPTIONS.map(({ value }) => value)) {
    assert.equal(ADJACENT_WARDS[ward].includes(ward), false);

    for (const adjacentWard of ADJACENT_WARDS[ward]) {
      assert.equal(
        ADJACENT_WARDS[adjacentWard].includes(ward),
        true,
        `${ward} と ${adjacentWard} の隣接関係が非対称です`,
      );
    }
  }
});
