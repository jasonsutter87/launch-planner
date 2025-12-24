"use client";

import { Button } from "@/components/ui/button";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {user.image && (
          <img
            src={user.image}
            alt={user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm text-gray-600">{user.name || user.email}</span>
      </div>
      <form action="/api/auth/signout" method="POST">
        <Button type="submit" variant="ghost" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
