import assert from "node:assert/strict";
import test from "node:test";

import {
  CHILD_CONSULTATION_CONTACTS,
  EMERGENCY_CALL_CONTACTS,
} from "./emergency-contacts.ts";
import { INFORMATION_REPORT_FORM_URL } from "./external-links.ts";
import { toTelHref } from "./phone.ts";

test("すべての連絡先に名称・電話番号・受付時間・説明がある", () => {
  for (const contact of [...CHILD_CONSULTATION_CONTACTS, ...EMERGENCY_CALL_CONTACTS]) {
    assert.ok(contact.name.trim(), "名称がある");
    assert.ok(contact.phone.trim(), `${contact.name} に電話番号がある`);
    assert.ok(contact.availability.trim(), `${contact.name} に受付時間がある`);
    assert.ok(contact.description.trim(), `${contact.name} に説明がある`);
  }
});

test("子ども向けの相談窓口として指定の2件を掲載している", () => {
  assert.deepEqual(
    CHILD_CONSULTATION_CONTACTS.map(({ name, phone }) => [name, phone]),
    [
      ["24時間こどもSOSダイヤル", "0120-0-78310"],
      ["チャイルドライン", "0120-99-7777"],
    ],
  );
});

test("掲載元の案内文をそのまま伝える", () => {
  const [sos, childline] = CHILD_CONSULTATION_CONTACTS;

  assert.equal(
    sos?.description,
    "いじめや学校生活の悩みなどを24時間いつでも無料で相談できる",
  );
  assert.equal(
    childline?.description,
    "チャイルドラインは子どものための相談先です。ちょっとしたことでも、おしゃべりしたいだけでも大丈夫。どんなことでも話してね。",
  );
});

test("いのちに関わる危険の通報先として110番・119番を残している", () => {
  assert.deepEqual(
    EMERGENCY_CALL_CONTACTS.map(({ phone }) => phone),
    ["110", "119"],
  );
});

test("電話番号から発信リンクを作る（ハイフンを除く）", () => {
  assert.equal(toTelHref("0120-0-78310"), "tel:0120078310");
  assert.equal(toTelHref("0120-99-7777"), "tel:0120997777");
  assert.equal(toTelHref("110"), "tel:110");
  assert.equal(toTelHref("045-510-1840"), "tel:0455101840");
});

test("すべての連絡先が発信リンクに変換できる", () => {
  for (const contact of [...CHILD_CONSULTATION_CONTACTS, ...EMERGENCY_CALL_CONTACTS]) {
    assert.match(toTelHref(contact.phone), /^tel:[0-9+]+$/, `${contact.name} の発信リンク`);
  }
});

test("報告フォームは https で、編集者向けパラメータを含まない", () => {
  assert.ok(INFORMATION_REPORT_FORM_URL.startsWith("https://"));
  assert.ok(
    !INFORMATION_REPORT_FORM_URL.includes("usp=publish-editor"),
    "編集者向けプレビュー用のパラメータを含まない",
  );
  assert.ok(
    !INFORMATION_REPORT_FORM_URL.includes("?"),
    "利用者を識別しうるクエリパラメータを付けない",
  );
});
