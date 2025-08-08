import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { useQueryFetchClient } from "@/lib/api/client";
import { parseErrorDetail } from "@/lib/utils";

function SignOutButton() {
  const router = useRouter();

  const { mutate, isPending } = useQueryFetchClient.useMutation(
    "post",
    "/api/v1/auth/logout",
    {
      onSuccess: () => {
        toast.success("Signed out successfully!");
        router.replace("/sign-in");
      },
      onError: (error: unknown) => {
        toast.error(
          parseErrorDetail(error) || "Failed to signing out. Please try again.",
        );
      },
    },
  );

  return (
    <Button onClick={() => mutate({})}>
      {!isPending ? "Sign Out" : <Loader />}
    </Button>
  );
}
export default SignOutButton;
