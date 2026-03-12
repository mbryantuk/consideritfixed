import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Button,
} from "@react-email/components";
import * as React from "react";

interface ReviewRequestEmailProps {
  customerName: string;
  requestTitle: string;
}

const baseUrl = process.env.NEXTAUTH_URL || "https://consideritfixed.co.uk";

export const ReviewRequestEmail = ({
  customerName = "Valued Customer",
  requestTitle = "your recent tech support",
}: ReviewRequestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>How did we do? Your feedback helps your neighbors in Felpham.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>How was your experience with Consider IT Fixed?</Heading>
          <Text style={text}>
            Hello {customerName},
          </Text>
          <Text style={text}>
            It&apos;s been a few days since we resolved your request: <strong>&quot;{requestTitle}&quot;</strong>.
          </Text>
          <Text style={text}>
            Our mission is to provide friendly, honest, and reliable tech support to the Felpham and Bognor Regis community. Your feedback is incredibly valuable to us and helps your neighbors know they can trust us too.
          </Text>
          
          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${baseUrl}/portal`}
            >
              Share Your Feedback
            </Button>
          </Section>

          <Text style={text}>
            Alternatively, if you have a moment, a review on <strong>Nextdoor</strong> or <strong>Google</strong> helps us reach more people in the local area who might need a hand with their technology.
          </Text>

          <Hr style={hr} />
          
          <Text style={footer}>
            <strong>Consider IT Fixed</strong><br />
            Friendly Local Tech Support<br />
            Felpham, West Sussex
          </Text>
          <Text style={footerMuted}>
            If you need further help with this or any other issue, please don&apos;t hesitate to reply to this email or call us directly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReviewRequestEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "8px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
};

const h1 = {
  color: "#0F172A",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0 40px",
};

const text = {
  color: "#334155",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "left" as const,
  padding: "0 40px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0D9488",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 40px",
};

const footer = {
  color: "#64748B",
  fontSize: "14px",
  lineHeight: "22px",
  textAlign: "left" as const,
  padding: "0 40px",
};

const footerMuted = {
  color: "#94A3B8",
  fontSize: "12px",
  lineHeight: "20px",
  textAlign: "left" as const,
  padding: "0 40px",
};
