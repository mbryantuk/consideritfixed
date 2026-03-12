import { Resend } from "resend";
import { render } from "@react-email/render";
import { TicketConfirmationEmail } from "@/emails/TicketConfirmationEmail";
import { QuoteNotificationEmail } from "@/emails/QuoteNotificationEmail";
import { AdminAlertEmail } from "@/emails/AdminAlertEmail";
import { AdminQuoteAcceptedEmail } from "@/emails/AdminQuoteAcceptedEmail";
import { NewMessageAlertEmail } from "@/emails/NewMessageAlertEmail";
import { StatusUpdateEmail } from "@/emails/StatusUpdateEmail";
import { InvoiceReadyEmail } from "@/emails/InvoiceReadyEmail";
import { PaymentReceiptEmail } from "@/emails/PaymentReceiptEmail";
import { ReviewRequestEmail } from "@/emails/ReviewRequestEmail";
import { QuoteReminderEmail } from "@/emails/QuoteReminderEmail";
import React from "react";

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  console.warn("⚠️ RESEND_API_KEY is not set. Emails will not be sent.");
}

const resend = new Resend(resendApiKey || "re_dummy");
const FROM_EMAIL = process.env.EMAIL_FROM || "Consider IT Fixed <onboarding@resend.dev>"; 
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "matt@example.com"; 

export async function sendTicketConfirmation(to: string, userName: string, ticketTitle: string, ticketId: string) {
  try {
    const html = await render(
      React.createElement(TicketConfirmationEmail, {
        userName,
        ticketTitle,
        ticketId,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Confirmation: Support Request Received - ${ticketTitle}`,
      html,
    });
  } catch (error) {
    console.error("Error sending ticket confirmation email:", error);
  }
}

export async function sendQuoteNotification(to: string, userName: string, ticketTitle: string, amount: string, ticketId: string) {
  try {
    const html = await render(
      React.createElement(QuoteNotificationEmail, {
        userName,
        ticketTitle,
        amount,
        ticketId,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `New Quote Available: ${ticketTitle}`,
      html,
    });
  } catch (error) {
    console.error("Error sending quote notification email:", error);
  }
}

export async function sendAdminNewTicketAlert(ticketTitle: string, customerName: string, ticketId: string) {
  try {
    const html = await render(
      React.createElement(AdminAlertEmail, {
        customerName,
        ticketTitle,
        ticketId,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🚨 NEW TICKET: ${customerName} - ${ticketTitle}`,
      html,
    });
  } catch (error) {
    console.error("Error sending admin alert email:", error);
  }
}

export async function sendAdminQuoteRespondedAlert(ticketTitle: string, customerName: string, ticketId: string, action: "ACCEPTED" | "REJECTED") {
  try {
    const html = await render(
      React.createElement(AdminQuoteAcceptedEmail, {
        customerName,
        ticketTitle,
        ticketId,
        action,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Quote ${action}: ${customerName} - ${ticketTitle}`,
      html,
    });
  } catch (error) {
    console.error("Error sending admin quote responded alert email:", error);
  }
}

export async function sendNewMessageAlert(to: string, senderName: string, ticketTitle: string, ticketId: string, messageText: string, isToAdmin: boolean) {
  try {
    const html = await render(
      React.createElement(NewMessageAlertEmail, {
        senderName,
        ticketTitle,
        ticketId,
        messageText,
        isToAdmin,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `New Message: ${ticketTitle}`,
      html,
    });
  } catch (error) {
    console.error("Error sending new message alert email:", error);
  }
}

export async function sendStatusUpdateEmail(to: string, userName: string, ticketTitle: string, ticketId: string, newStatus: string) {
  try {
    const html = await render(
      React.createElement(StatusUpdateEmail, {
        userName,
        ticketTitle,
        ticketId,
        newStatus,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Status Update: ${ticketTitle}`,
      html,
    });
  } catch (error) {
    console.error("Error sending status update email:", error);
  }
}

export async function sendInvoiceReadyEmail(to: string, userName: string, ticketTitle: string, ticketId: string, amount: string) {
  try {
    const html = await render(
      React.createElement(InvoiceReadyEmail, {
        userName,
        ticketTitle,
        ticketId,
        amount,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Invoice Ready: ${ticketTitle}`,
      html,
    });
  } catch (error) {
    console.error("Error sending invoice ready email:", error);
  }
}

export async function sendPaymentReceiptEmail(to: string, userName: string, ticketTitle: string, ticketId: string, amount: string) {
  try {
    const html = await render(
      React.createElement(PaymentReceiptEmail, {
        userName,
        ticketTitle,
        ticketId,
        amount,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Payment Received: ${ticketTitle}`,
      html,
    });
  } catch (error) {
    console.error("Error sending payment receipt email:", error);
  }
}

export async function sendReviewRequestEmail(to: string, customerName: string, requestTitle: string) {
  try {
    const html = await render(
      React.createElement(ReviewRequestEmail, {
        customerName,
        requestTitle,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `How was your experience? - ${requestTitle}`,
      html,
    });
  } catch (error) {
    console.error("Error sending review request email:", error);
  }
}

export async function sendQuoteReminder(to: string, userName: string, ticketTitle: string, ticketId: string, expiresAt: Date) {
  try {
    const html = await render(
      React.createElement(QuoteReminderEmail, {
        userName,
        ticketTitle,
        ticketId,
        expiresAt,
      })
    );

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Reminder: Your Quote for ${ticketTitle} Expires Soon`,
      html,
    });
  } catch (error) {
    console.error("Error sending quote reminder email:", error);
  }
}
