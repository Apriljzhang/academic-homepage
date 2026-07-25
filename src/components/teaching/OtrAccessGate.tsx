import { useEffect, useState, type FormEvent, type ReactNode } from "react";

const STORAGE_KEY = "OTR_ACCESS_202607";
const ACCESS_PASSWORD = "20260727";

type Props = {
  children: ReactNode;
};

export default function OtrAccessGate({ children }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(STORAGE_KEY) === ACCESS_PASSWORD) {
        setUnlocked(true);
      }
    } finally {
      setReady(true);
    }
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (value.trim() !== ACCESS_PASSWORD) {
      setError("Incorrect password.");
      return;
    }
    window.sessionStorage.setItem(STORAGE_KEY, ACCESS_PASSWORD);
    setError("");
    setUnlocked(true);
  }

  if (!ready) {
    return (
      <div className="grid min-h-[24rem] place-items-center rounded-2xl border border-border bg-surface p-8">
        <p className="text-sm text-muted">Loading resource…</p>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Open Teaching Resources</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">Password required</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Enter the access password for this teaching resource. Access remains on this device for the current browser
            session.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-ink">
              Password
              <input
                type="password"
                name="otr-password"
                autoComplete="current-password"
                value={value}
                onChange={(event) => {
                  setValue(event.target.value);
                  if (error) setError("");
                }}
                className="mt-2 min-h-11 w-full rounded-lg border border-border bg-page px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
              />
            </label>
            {error && (
              <p className="text-sm font-semibold text-primary" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="min-h-11 w-full rounded-lg bg-ink px-4 text-sm font-bold text-white hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              Unlock resource
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
