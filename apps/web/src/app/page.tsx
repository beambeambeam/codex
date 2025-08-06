import { env } from "@/env";

function LandingPage() {
  return (
    <div>
      <div>API URL: {env.NEXT_PUBLIC_API_URL}</div>
    </div>
  );
}
export default LandingPage;
