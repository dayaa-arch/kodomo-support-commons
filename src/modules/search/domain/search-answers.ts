import type {
  SupportTheme,
  TargetAudience,
} from "../../../shared/domain/support-taxonomy.ts";
import type { Ward } from "../../../shared/domain/wards.ts";

export interface SearchAnswers {
  readonly targetAudience: TargetAudience;
  readonly targetAudienceOther?: string;
  readonly supportTheme: SupportTheme;
  readonly supportThemeOther?: string;
  readonly ward: Ward;
}

export type SearchAnswersDraft = Partial<SearchAnswers>;

export type WizardStep = 1 | 2 | 3;

function hasMeaningfulText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

export function validateWizardStep(
  step: WizardStep,
  draft: SearchAnswersDraft,
): string | null {
  if (step === 1) {
    if (!draft.targetAudience) {
      return "どなたのために探すかを選んでください。";
    }

    if (
      draft.targetAudience === "other" &&
      !hasMeaningfulText(draft.targetAudienceOther)
    ) {
      return "「その他」の内容を入力してください。";
    }
  }

  if (step === 2) {
    if (!draft.supportTheme) {
      return "いちばん困っていることを1つ選んでください。";
    }

    if (
      draft.supportTheme === "other" &&
      !hasMeaningfulText(draft.supportThemeOther)
    ) {
      return "「その他」の内容を入力してください。";
    }
  }

  if (step === 3 && !draft.ward) {
    return "探したい地域を選んでください。";
  }

  return null;
}

export function toSearchAnswers(draft: SearchAnswersDraft): SearchAnswers | null {
  if (
    validateWizardStep(1, draft) ||
    validateWizardStep(2, draft) ||
    validateWizardStep(3, draft) ||
    !draft.targetAudience ||
    !draft.supportTheme ||
    !draft.ward
  ) {
    return null;
  }

  return {
    targetAudience: draft.targetAudience,
    targetAudienceOther: draft.targetAudienceOther?.trim() || undefined,
    supportTheme: draft.supportTheme,
    supportThemeOther: draft.supportThemeOther?.trim() || undefined,
    ward: draft.ward,
  };
}
