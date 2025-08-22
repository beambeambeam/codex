import { Settings2Icon, UserIcon, UserPenIcon } from "lucide-react";

import DisplayForm from "@/components/settings/display-form";
import SignOutButton from "@/components/sign-out";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Scroller } from "@/components/ui/scroller";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/store/user";

function Settings() {
  const TABS_TRIGGER_CLASSNAME =
    "hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary hover:after:bg-accent data-[state=active]:hover:bg-accent relative w-full justify-start rounded-none border-none py-6 after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-1 data-[state=active]:bg-transparent data-[state=active]:shadow-none";

  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-4xl max-w-full p-0">
        <DialogHeader className="p-0 px-6 pt-5">
          <DialogTitle>User&apos;s Settings</DialogTitle>
          <DialogDescription hidden>
            This is dialog for settings change for overall
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto border-t-2">
          <Tabs
            defaultValue="tab-1"
            orientation="vertical"
            className="h-[70vh] w-full flex-row !gap-0"
          >
            <TabsList className="text-foreground flex-col items-start justify-start gap-1 rounded-none bg-transparent py-0 !pr-0">
              <TabsTrigger value="tab-1" className={TABS_TRIGGER_CLASSNAME}>
                <UserPenIcon
                  className="-ms-0.5 me-1.5 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Account
              </TabsTrigger>
            </TabsList>
            <Separator orientation="vertical" />
            <TabsContent value="tab-1" className="p-2">
              <Scroller className="flex h-full flex-col gap-y-4">
                <div className="flex items-center gap-6">
                  <Avatar className="size-36">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <UserIcon className="size-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <DisplayForm
                      defaultValues={{
                        display: user.display,
                      }}
                    />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-accent-foreground/50 text-base">
                        ({user.username})
                      </p>
                      <p className="text-base">{user.email}</p>
                    </div>
                  </div>
                </div>
                <div className="">
                  <SignOutButton />
                </div>
              </Scroller>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Settings;
