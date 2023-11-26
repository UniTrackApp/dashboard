import { getServerSession } from "next-auth";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { authOptions } from "~/server/auth";

export default async function Settings() {
  const user = await getServerSession(authOptions);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account settings
        </p>
      </div>
      <Separator />
      {!!user?.user && (
        <div>
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-semibold">Profile</h2>
              <p className="text-muted-foreground">
                This is your personal profile settings
              </p>
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <p className="mb-2 text-sm">Profile Picture</p>
                {user.user.image && (
                  <>
                    <Image
                      src={user.user.image}
                      alt="Logo"
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                  </>
                )}
              </div>
              <div>
                <p className="mb-2 text-sm">Name</p>
                <Input
                  type="text"
                  id="name"
                  className="w-[400px]"
                  defaultValue={user.user.name!}
                  disabled
                />
              </div>
              <div>
                <p className="mb-2 text-sm">Email</p>
                <Input
                  type="text"
                  id="name"
                  className="w-[400px]"
                  defaultValue={user.user.email!}
                  disabled
                />
              </div>
              <Button className="w-fit">Save changes</Button>
            </div>
          </div>
        </div>
      )}
      {!user && (
        <div>
          <p>Not logged in</p>
        </div>
      )}
    </div>
  );
}
