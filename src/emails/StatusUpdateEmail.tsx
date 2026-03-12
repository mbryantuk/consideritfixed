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

interface StatusUpdateEmailProps {
  userName: string;
  ticketTitle: string;
  ticketId: string;
  newStatus: string;
}

export const StatusUpdateEmail = ({
  userName,
  ticketTitle,
  ticketId,
  newStatus,
}: StatusUpdateEmailProps) => {
  const previewText = `Update on your support request: ${ticketTitle}`;

  // Map status codes to friendly text
  const statusLabels: Record<string, string> = {
    OPEN: "Logged & Pending",
    QUOTED: "Quote Provided",
    IN_PROGRESS: "Work In Progress",
    AWAITING_PARTS: "Awaiting Parts",
    CLOSED: "Job Complete",
  };
  
  const friendlyStatus = statusLabels[newStatus] || newStatus;

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
                The status of your support request <strong>&quot;{ticketTitle}&quot;</strong> has been updated.
              </Text>
              <Section style={detailsBox}>
                <Text style={detailsTitle}>New Status:</Text>
                <Text style={detailsContent}>{friendlyStatus}</Text>
              </Section>
              <Section style={btnContainer}>
                <Button
                  style={button}
                  href={`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/portal/requests/${ticketId}`}
                >
                  View Full Details
                </Button>
              </Section>
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

export default StatusUpdateEmail;

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

const detailsBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  padding: "20px",
  margin: "24px 0",
};

const detailsTitle = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#64748b",
  textTransform: "uppercase" as const,
  margin: "0 0 8px 0",
};

const detailsContent = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#0d9488",
  margin: "0",
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
