export function getOtpEmailTemplate(otp: string): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vendor OS Verification Code</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f7f5;
    font-family: Arial, Helvetica, sans-serif;
    color: #1f2937;
  "
>
  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    style="background-color: #f4f7f5;"
  >
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Main Card -->
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width: 560px;
            background-color: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                background-color: #16a34a;
                padding: 32px 24px;
              "
            >
              <!-- Temporary Logo -->
              <img
                src="https://placehold.co/90x90/ffffff/16A34A?text=VOS"
                width="90"
                height="90"
                alt="Vendor OS"
                style="
                  display: block;
                  width: 90px;
                  height: 90px;
                  border-radius: 20px;
                  margin: 0 auto 16px auto;
                  border: 0;
                "
              />

              <div
                style="
                  color: #ffffff;
                  font-size: 26px;
                  line-height: 32px;
                  font-weight: 700;
                "
              >
                Vendor OS
              </div>

              <div
                style="
                  color: #dcfce7;
                  font-size: 14px;
                  line-height: 22px;
                  margin-top: 5px;
                "
              >
                Your business. Simpler.
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 38px 36px 20px 36px;">

              <div
                style="
                  text-align: center;
                  font-size: 25px;
                  line-height: 34px;
                  font-weight: 700;
                  color: #111827;
                "
              >
                Verify your login
              </div>

              <div
                style="
                  text-align: center;
                  font-size: 15px;
                  line-height: 24px;
                  color: #6b7280;
                  margin-top: 12px;
                "
              >
                Use the verification code below to securely
                sign in to your Vendor OS account.
              </div>

              <!-- OTP -->
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="margin-top: 30px;"
              >
                <tr>
                  <td
                    align="center"
                    style="
                      background-color: #f0fdf4;
                      border: 1px solid #bbf7d0;
                      border-radius: 16px;
                      padding: 25px 16px;
                    "
                  >
                    <div
                      style="
                        color: #6b7280;
                        font-size: 12px;
                        line-height: 18px;
                        font-weight: 700;
                        letter-spacing: 1.5px;
                        text-transform: uppercase;
                        margin-bottom: 10px;
                      "
                    >
                      Your verification code
                    </div>

                    <div
                      style="
                        color: #15803d;
                        font-size: 38px;
                        line-height: 46px;
                        font-weight: 700;
                        letter-spacing: 10px;
                      "
                    >
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Expiry -->
              <div
                style="
                  text-align: center;
                  margin-top: 18px;
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 22px;
                "
              >
                This code will expire in
                <strong style="color: #111827;">
                  5 minutes
                </strong>.
              </div>

            </td>
          </tr>

          <!-- Security -->
          <tr>
            <td style="padding: 10px 36px 32px 36px;">
              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >
                <tr>
                  <td
                    style="
                      background-color: #f9fafb;
                      border-radius: 12px;
                      padding: 16px 18px;
                    "
                  >
                    <div
                      style="
                        font-size: 14px;
                        line-height: 20px;
                        font-weight: 700;
                        color: #374151;
                        margin-bottom: 5px;
                      "
                    >
                      Security reminder
                    </div>

                    <div
                      style="
                        font-size: 13px;
                        line-height: 20px;
                        color: #6b7280;
                      "
                    >
                      Never share this verification code with anyone.
                      Vendor OS will never ask you for your OTP by
                      phone, message, or email.
                    </div>
                  </td>
                </tr>
              </table>

              <div
                style="
                  text-align: center;
                  margin-top: 25px;
                  color: #9ca3af;
                  font-size: 13px;
                  line-height: 20px;
                "
              >
                Didn't request this login?
                You can safely ignore this email.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                background-color: #f9fafb;
                border-top: 1px solid #f3f4f6;
                padding: 24px 20px;
              "
            >
              <div
                style="
                  color: #374151;
                  font-size: 14px;
                  font-weight: 700;
                "
              >
                Vendor OS
              </div>

              <div
                style="
                  color: #9ca3af;
                  font-size: 12px;
                  line-height: 18px;
                  margin-top: 6px;
                "
              >
                Helping vendors manage their business smarter.
              </div>

              <div
                style="
                  color: #9ca3af;
                  font-size: 11px;
                  line-height: 18px;
                  margin-top: 12px;
                "
              >
                This is an automated security email.
                Please do not reply.
              </div>
            </td>
          </tr>

        </table>

        <!-- Copyright -->
        <div
          style="
            max-width: 560px;
            text-align: center;
            color: #9ca3af;
            font-size: 11px;
            line-height: 18px;
            margin-top: 20px;
          "
        >
          © ${currentYear} Vendor OS. All rights reserved.
        </div>

      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
