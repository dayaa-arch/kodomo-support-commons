import { WizardScreen } from "@/src/modules/search/presentation/WizardScreen";
import { HomeInformation } from "@/src/shared/presentation/HomeInformation";
import { HomeIntro } from "@/src/shared/presentation/HomeIntro";

export default function Home() {
  return (
    <>
      <HomeIntro />
      <WizardScreen />
      <HomeInformation />
    </>
  );
}
