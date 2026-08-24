import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Bike, Crown, Lock, Mail, Phone, UserRound } from "lucide-react";
import { toast } from "sonner";

import { AuthScene } from "@/components/auth/auth-scene";
import { ROLE_COPY, ROLE_HOME, signUpLocal, type AccountRole } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your Account — Kennedy Moon Grill" },
      {
        name: "description",
        content:
          "Join Kennedy Moon Grill as a customer, staff member or delivery rider and land straight in your own console.",
      },
      { property: "og:title", content: "Create Your Account — Kennedy Moon Grill" },
      {
        property: "og:description",
        content: "Sign up as customer, staff or rider — each role gets its own dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

const ROLES: { key: AccountRole; icon: typeof UserRound }[] = [
  { key: "customer", icon: UserRound },
  { key: "staff", icon: Crown },
  { key: "rider", icon: Bike },
];

function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<AccountRole>("customer");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.password.trim()) {
      toast.error("Fill in every field to continue");
      return;
    }
    const account = signUpLocal({ ...form, role });
    toast.success(`Account ready, ${account.name.split(" ")[0]}`, {
      description:
        role === "rider"
          ? "Finish your rider profile and share your location to start taking jobs."
          : `Taking you to the ${ROLE_COPY[role].destination.toLowerCase()}.`,
    });
    setTimeout(() => navigate({ to: ROLE_HOME[role] }), 360);
  }

  return (
    <AuthScene
      eyebrow="Join the grill"
      title="Create account"
      subtitle="Choose your role — customer, staff or rider — and we'll set up the matching dashboard."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-extrabold text-flame hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <p className="mb-2 font-display text-[10px] font-extrabold tracking-[0.2em] text-charcoal/60 uppercase">
            I'm signing up as
          </p>
          <div className="space-y-2">
            {ROLES.map(({ key, icon: Icon }) => (
              <motion.button
                key={key}
                type="button"
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole(key)}
                className={cn(
                  "role-tile flex w-full items-center gap-3",
                  role === key && "role-tile-active",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    role === key ? "bg-flame/15 text-flame" : "bg-charcoal/8 text-charcoal/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-xs font-extrabold tracking-[0.14em] text-charcoal uppercase">
                    {ROLE_COPY[key].label}
                  </span>
                  <span className="block text-[11px] leading-snug text-charcoal/60">
                    {ROLE_COPY[key].tagline}
                  </span>
                </span>
                <span
                  className={cn(
                    "ml-auto h-3.5 w-3.5 shrink-0 rounded-full border-2",
                    role === key ? "border-flame bg-flame" : "border-charcoal/25",
                  )}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="auth-field-wrap block">
            <UserRound className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            <input
              value={form.name}
              onChange={set("name")}
              placeholder="Full name"
              className="auth-field"
              autoComplete="name"
            />
          </label>
          <label className="auth-field-wrap block">
            <Phone className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
            <input
              value={form.phone}
              onChange={set("phone")}
              placeholder="03xx xxxxxxx"
              className="auth-field"
              autoComplete="tel"
            />
          </label>
        </div>

        <label className="auth-field-wrap block">
          <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="you@email.com"
            className="auth-field"
            autoComplete="email"
          />
        </label>

        <label className="auth-field-wrap block">
          <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
          <input
            type="password"
            value={form.password}
            onChange={set("password")}
            placeholder="Create a password"
            className="auth-field"
            autoComplete="new-password"
          />
        </label>

        <button type="submit" className="auth-cta">
          Create account &amp; open {ROLE_COPY[role].destination}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthScene>
  );
}
