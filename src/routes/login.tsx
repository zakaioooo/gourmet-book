import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bike, Crown, Lock, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";

import { AuthScene } from "@/components/auth/auth-scene";
import { ROLE_COPY, ROLE_HOME, signInLocal, type AccountRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Kennedy Moon Grill Account" },
      {
        name: "description",
        content:
          "Sign in to Kennedy Moon Grill to track live orders, run the owner console or pick up delivery jobs as a rider.",
      },
      { property: "og:title", content: "Sign In — Kennedy Moon Grill" },
      {
        property: "og:description",
        content: "One account for guests, kitchen staff and delivery riders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const ROLES: { key: AccountRole; icon: typeof UserRound }[] = [
  { key: "customer", icon: UserRound },
  { key: "staff", icon: Crown },
  { key: "rider", icon: Bike },
];

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<AccountRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Enter your email and password");
      return;
    }
    setBusy(true);
    const account = signInLocal(email, role);
    toast.success(`Welcome back, ${account.name}`);
    setTimeout(() => navigate({ to: ROLE_HOME[role] }), 320);
  }

  return (
    <AuthScene
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Pick how you're arriving tonight — we'll drop you straight into the right console."
      footer={
        <>
          New to the grill?{" "}
          <Link to="/signup" className="font-extrabold text-flame hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <p className="mb-2 font-display text-[10px] font-extrabold tracking-[0.2em] text-charcoal/60 uppercase">
            Sign in as
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map(({ key, icon: Icon }) => (
              <motion.button
                key={key}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setRole(key)}
                className={cn("role-tile px-2 py-3 text-center", role === key && "role-tile-active")}
              >
                <Icon
                  className={cn(
                    "mx-auto h-5 w-5",
                    role === key ? "text-flame" : "text-charcoal/50",
                  )}
                />
                <span className="mt-1.5 block font-display text-[10px] font-extrabold tracking-[0.12em] text-charcoal uppercase">
                  {ROLE_COPY[key].label}
                </span>
              </motion.button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-charcoal/55">{ROLE_COPY[role].tagline}</p>
        </div>

        <label className="auth-field-wrap block">
          <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="auth-field"
            autoComplete="email"
          />
        </label>

        <label className="auth-field-wrap block">
          <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="auth-field"
            autoComplete="current-password"
          />
        </label>

        <button type="submit" disabled={busy} className="auth-cta">
          Enter {ROLE_COPY[role].destination}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthScene>
  );
}
