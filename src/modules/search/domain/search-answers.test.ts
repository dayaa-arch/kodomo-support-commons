import assert from "node:assert/strict";
import test from "node:test";

import { toSearchAnswers, validateWizardStep } from "./search-answers.ts";

test("その他を選んだ場合は自由記述を必須にする", () => {
  assert.equal(
    validateWizardStep(1, { targetAudience: "other" }),
    "「その他」の内容を入力してください。",
  );
  assert.equal(
    validateWizardStep(2, { supportTheme: "other" }),
    "「その他」の内容を入力してください。",
  );
});

test("3問が揃った回答だけを検索条件へ変換する", () => {
  assert.equal(
    toSearchAnswers({
      targetAudience: "child",
      supportTheme: "school-absence",
    }),
    null,
  );

  assert.deepEqual(
    toSearchAnswers({
      targetAudience: "other",
      targetAudienceOther: "  学校の先生  ",
      supportTheme: "family",
      ward: "kohoku",
    }),
    {
      targetAudience: "other",
      targetAudienceOther: "学校の先生",
      supportTheme: "family",
      supportThemeOther: undefined,
      ward: "kohoku",
    },
  );
});
