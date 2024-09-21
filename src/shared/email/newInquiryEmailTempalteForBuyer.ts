export const newInquiryEmailTempalteForBuyer = (
  propertyName: string,
  ownerName: string,
) => {
  return `
       <div style="font-family: Arial, sans-serif; line-height: 1.6;">

      <p style="margin-top: 2px;">Dear Buyer,</p>

      <p style="margin-top: 4px;">
        Thank you for your interest in <strong>${propertyName}</strong>. Your inquiry has been successfully submitted, and the owner <strong>${ownerName}</strong> will respond to you soon.
      </p>

      <div style="border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9; border-radius: 5px; margin-top: 15px;">
        <h3 style="margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #eee;">What Happens Next?</h3>
        <p style="margin: 10px 0;">The property owner will review your inquiry and get in touch with you for further discussions or property viewing arrangements.</p>
        <p style="margin: 10px 0;">You will be notified as soon as the owner responds.</p>
      </div>

      <p style="margin-top: 20px;">
        If you have any further questions or need assistance, feel free to reach out.</p>

      <p style="margin-top: 20px;">Best regards,<br><strong>House Hub Team</strong></p>

      <hr style="border-top: 1px solid #eee; margin-top: 20px;" />

      <p style="font-size: 12px; color: #999;">
        This email is sent in response to your inquiry about <strong>${propertyName}</strong>. If you did not make this inquiry, please disregard this email.
      </p>
    </div>
      `;
};
