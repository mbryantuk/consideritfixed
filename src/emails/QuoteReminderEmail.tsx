import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface QuoteReminderEmailProps {
  userName: string;
  ticketTitle: string;
  ticketId: string;
  expiresAt: Date;
}

export const QuoteReminderEmail = ({
  userName,
  ticketTitle,
  ticketId,
  expiresAt,
}: QuoteReminderEmailProps) => (
  <Html>
    <Head />
    <Preview>Friendly reminder: Your quote for {ticketTitle} expires soon!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Don&apos;t miss out!</Heading>
        <Text style={text}>Hi {userName},</Text>
        <Text style={text}>
          This is just a friendly reminder that your quote for &quot;<strong>{ticketTitle}</strong>&quot; is set to expire on {new Date(expiresAt).toLocaleDateString('en-GB')}.
        </Text>
        <Text style={text}>
          If you&apos;d like to proceed with the fix, please accept the quote in your portal before it expires.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={`https://consideritfixed.uk/portal/requests/${ticketId}`}>
            View & Accept Quote
          </Button>
        </Section>
        <Text style={text}>
          If you have any questions or need to discuss the details further, feel free to reply to this email or leave a message on the ticket.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          Consider IT Fixed - Felpham, West Sussex
        </Text>
      </Container>
    </Body>
  </Html>
);

export default QuoteReminderEmail;

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
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 48px",
};

const btnContainer = {
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#0D9488",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
  margin: "20px 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};
