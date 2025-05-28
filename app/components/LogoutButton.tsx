import { LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth/auth-client";

function LogoutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await authClient.signOut();
    await queryClient.invalidateQueries();
    router.invalidate();
  };

  return (
    <Button variant={"destructive"} onClick={handleLogout}>
      <LogOut /> <span>Log out</span>
    </Button>
  );
}
export default LogoutButton;
