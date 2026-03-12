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

interface TicketConfirmationEmailProps {
  userName: string;
  ticketTitle: string;
  ticketId: string;
}

export const TicketConfirmationEmail = ({
  userName,
  ticketTitle,
  ticketId,
}: TicketConfirmationEmailProps) => {
  const previewText = `Confirmation: We've received your request "${ticketTitle}"`;

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
                I&apos;ve successfully received your support request: <strong>&quot;{ticketTitle}&quot;</strong>.
              </Text>
              <Text style={paragraph}>
                I will review the details and get back to you shortly with advice or a quote through your online portal.
              </Text>
              <Section style={btnContainer}>
                <Button
                  style={button}
                  href={`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/portal/requests/${ticketId}`}
                >
                  View Ticket Status
                </Button>
              </Section>
              <Hr style={hr} />
              <Text style={footer}>
                No Fix, No Fee. No Jargon. Just Simple Help.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default TicketConfirmationEmail;

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
