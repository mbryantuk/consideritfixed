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

interface QuoteNotificationEmailProps {
  userName: string;
  ticketTitle: string;
  amount: string;
  ticketId: string;
}

export const QuoteNotificationEmail = ({
  userName,
  ticketTitle,
  amount,
  ticketId,
}: QuoteNotificationEmailProps) => {
  const previewText = `New Quote Available: £${amount} for "${ticketTitle}"`;

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
                I have prepared a quote for your request: <strong>&quot;{ticketTitle}&quot;</strong>.
              </Text>
              <Section style={amountBox}>
                <Text style={amountText}>Amount: £{amount}</Text>
              </Section>
              <Text style={paragraph}>
                Please log in to your portal to review the full details and accept the quote so I can begin the work.
              </Text>
              <Section style={btnContainer}>
                <Button
                  style={button}
                  href={`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/portal/requests/${ticketId}`}
                >
                  Review & Accept Quote
                </Button>
              </Section>
              <Hr style={hr} />
              <Text style={footer}>
                Reliable. Local. Jargon-Free.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default QuoteNotificationEmail;

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

const amountBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  padding: "24px",
  textAlign: "center" as const,
  margin: "24px 0",
};

const amountText = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#3b82f6",
  margin: "0",
};

const btnContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#2563eb",
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
