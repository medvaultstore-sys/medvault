"use client";
/**
 * BackButtonGuard
 *
 * Problem: Users arriving from an external link (WhatsApp, Google, Instagram)
 * press the back button and exit the site instead of staying on the homepage.
 *
 * Solution:
 * - If user came from an external/unknown source → push a guard state, intercept
 *   back press, and redirect to "/" instead of exiting.
 * - If user navigated internally (referrer is same origin) → do nothing, let
 *   the browser handle back navigation normally.
 *
 * Works on: Chrome Android, Safari iOS, all mobile browsers.
 * Place this component once in app/layout.js inside <body>.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BackButtonGuard() {
  const router = useRouter();

  useEffect(() => {
    const origin = window.location.origin;

    // Capture referrer once at mount — this is the page the user came FROM.
    // document.referrer is empty for direct/typed URLs, bookmarks, and most
    // WhatsApp/Instagram opens (they strip the referrer header).
    const referrer = document.referrer;
    const cameFromSameSite =
      referrer.length > 0 && referrer.startsWith(origin);

    // If the user navigated here from within the site, the browser's normal
    // back stack is correct — don't interfere.
    if (cameFromSameSite) return;

    // User arrived from external or direct. Push a "guard" state on top of
    // the external history entry. Now the history stack looks like:
    //   [...external pages, medvault.store/, {__mv_guard}]  ← current
    // The first back press pops the guard state. Our popstate listener fires
    // and we push the guard again + redirect to "/" (which is a no-op if
    // already there). The user never exits to the external page.
    history.pushState({ __mv_guard: true }, "");

    const onPopState = (e) => {
      // Re-push the guard so subsequent back presses are also caught.
      history.pushState({ __mv_guard: true }, "");

      // If not already on homepage, go there.
      if (window.location.pathname !== "/") {
        router.replace("/");
      }
      // If already on "/", the pushState above is enough — the browser
      // stays on the page and the guard remains in place.
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);

    // router is stable in Next.js App Router — no need to list as dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // Renders nothing — pure behavior component.
}
