const SENDGRID_MAIL_SEND_URL = "https://api.sendgrid.com/v3/mail/send";

export class EmailServiceAdapter {
  constructor(config) {
    this.config = config;
  }

  async sendEmail(toEmail, subject, message) {
    try {
      const response = await fetch(SENDGRID_MAIL_SEND_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.EMAIL_SERVICE_API_KEY_VALUE}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: this.config.FORGET_PASSWORD_EMAIL_SENDER },
          subject: subject,
          content: [{ type: "text/plain", value: message }],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        const error = new Error(
          `sendgrid mail send failed with status ${response.status}: ${errorBody}`
        );
        console.log("failed to send password reset email, error: ", error);
        return error;
      }

      return null;
    } catch (error) {
      console.log("failed to send password reset email, error: ", error);
      return error;
    }
  }
}
