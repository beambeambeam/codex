import { ToggleThemeButton } from "@/components/ui/toggle-theme";
import { env } from "@/env";

function LandingPage() {
  return (
    <div>
      <div>API URL: {env.NEXT_PUBLIC_API_URL}</div>
      <div className="flex w-fit">
        <ToggleThemeButton />
      </div>
      กาาร
    </div>
  );
}
export default LandingPage;
