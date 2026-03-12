import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { MagicLinkEmail } from "@/emails/MagicLinkEmail";
import React from "react";
import { rateLimit } from "./rate-limit";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn("⚠️ RESEND_API_KEY is not set. Magic Link emails will not be sent.");
}

const resend = new Resend(resendApiKey || "re_dummy");
const FROM_EMAIL = process.env.EMAIL_FROM || "Consider IT Fixed <onboarding@resend.dev>";

export const authOptions: NextAuthOptions = {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    EmailProvider({
      server: "",
      from: FROM_EMAIL, 
      maxAge: 24 * 60 * 60, // 24 hours
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // Rate limit by email address (identifier)
        const limitResult = await rateLimit(`magic-link:${identifier}`, 5, 3600); // 5 attempts per hour
        if (!limitResult.success) {
          console.warn(`[Auth] Rate limit exceeded for ${identifier}`);
          // NextAuth will catch this and redirect to signin?error=Verification
          throw new Error("TOO_MANY_REQUESTS");
        }

        // ALWAYS LOG THE LINK FOR NOW
        console.log(`\n======================================================`);
        console.log(`MAGIC LOGIN LINK FOR ${identifier}:`);
        console.log(url);
        console.log(`======================================================\n`);

        // Only send real emails in production, unless ALLOW_DEV_EMAILS is set
        if (process.env.NODE_ENV === "development" && process.env.ALLOW_DEV_EMAILS !== "true") {
          console.log("ℹ️ Skipping email send in development mode. (Set ALLOW_DEV_EMAILS=true to override)");
          return;
        }

        try {
          const html = await render(
            React.createElement(MagicLinkEmail, {
              url,
            })
          );

          await resend.emails.send({
            from: provider.from,
            to: identifier,
            subject: "Sign in to Consider IT Fixed",
            html,
          });
        } catch (error) {
          console.error("Failed to send verification email", error);
          throw new Error("Failed to send verification email");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user.role = (user as any).role; 
      }
      return session;
    },
  },
};
