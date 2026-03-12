import {
  Body,
  Button,
  Container,
  Head,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface PaymentReceiptEmailProps {
  userName: string;
  ticketTitle: string;
  ticketId: string;
  amount: string;
}

export const PaymentReceiptEmail = ({
  userName,
  ticketTitle,
  ticketId,
  amount,
}: PaymentReceiptEmailProps) => {
  const previewText = `Payment Received for ${ticketTitle} - Thank You!`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body style={main}>
          <Container style={container}>
            <Section style={header}>
              <Img
                src={`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/logo.svg`}
                width="200"
                height="66"
                alt="Consider IT Fixed"
                style={logo}
              />
            </Section>
            <Section style={content}>
              <Text style={paragraph}>Hi {userName},</Text>
              <Text style={paragraph}>
                This is a quick note to confirm I have received your payment of <strong>£{amount}</strong> for the work on <strong>&quot;{ticketTitle}&quot;</strong>.
              </Text>
              <Text style={paragraph}>
                Your invoice is now marked as PAID. You can download a PDF receipt anytime from your portal.
              </Text>
              <Section style={btnContainer}>
                <Button
                  style={button}
                  href={`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/portal/requests/${ticketId}`}
                >
                  View Receipt
                </Button>
              </Section>
              <Text style={paragraph}>
                If you have a moment, I would really appreciate it if you could leave a quick review on your experience using the feedback button on your ticket.
              </Text>
              <Hr style={hr} />
              <Text style={footer}>
                Consider IT Fixed - Reliable, Local, Jargon-Free.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default PaymentReceiptEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
};

const header = {
  backgroundColor: "#ffffff",
  padding: "32px",
  textAlign: "center" as const,
  borderBottom: "1px solid #e2e8f0",
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "40px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#1e293b",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0d9488",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  fontWeight: "bold",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "20px 0",
};

const footer = {
  color: "#64748b",
  fontSize: "14px",
  lineHeight: "24px",
};
