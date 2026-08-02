import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";

/**
 * Soft prompt that appears when the user has received recommendations.
 * Encourages sign-in only when it adds real value.
 */
export default function SaveProgressPrompt({ hasRecommendations = false }) {
  if (!hasRecommendations) return null;

  return (
    <>
      <SignedOut>
        <div className="mt-4 rounded-xl border-2 border-dashed border-ib-denim/40 bg-white/80 p-4 text-sm dark:bg-[#1E1E1E]/80">
          <p className="font-semibold text-text-primaryLight dark:text-text-primaryDark">
            Want to save this pathway and track your progress?
          </p>
          <p className="mt-1 text-text-secondaryLight dark:text-text-secondaryDark">
            Create a free account to keep your personalized resource plan and come back later.
          </p>
          <SignInButton mode="modal">
            <button
              type="button"
              className="mt-3 rounded-full bg-ib-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-ib-greenAlt"
            >
              Save my progress
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="mt-4 rounded-xl border border-ib-green/30 bg-ib-green/10 p-4 text-sm">
          <p className="font-semibold text-ib-green">
            Progress tracking is active
          </p>
          <p className="mt-1 text-text-primaryLight dark:text-text-primaryDark">
            Your recommendations and next steps will be saved to your account.
            (Full history & plan view coming next.)
          </p>
        </div>
      </SignedIn>
    </>
  );
}
