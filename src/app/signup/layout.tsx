import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Clearance",
  description: "Sign up for VeriHire AI and protect yourself against sophisticated recruitment fraud campaigns.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
