import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { getPrimaryRole, ROLE_LABELS } from "../../lib/roles";

/**
 * Soft auth UI for the Resource Discovery Agent.
 * Login is optional — only needed for saving plans / tracking progress.
 */
export default function AuthHeader() {
  const { user } = useUser();
  const role = getPrimaryRole(user);

  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            className="rounded-full border-2 border-ib-denim bg-white px-4 py-2 text-sm font-semibold text-ib-denim transition hover:bg-ib-denim hover:text-white dark:bg-transparent dark:text-ib-linen dark:hover:bg-ib-denim"
          >
            Sign in to save progress
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-3">
          {role && (
            <span className="hidden text-xs font-medium uppercase tracking-wider text-ib-denim dark:text-ib-linen sm:inline">
              {ROLE_LABELS[role] || role}
            </span>
          )}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </div>
      </SignedIn>
    </div>
  );
}
