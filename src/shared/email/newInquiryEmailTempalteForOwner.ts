export const newInquiryEmailTemplateForOwner = (
  buyerName: string,
  buyerEmail: string,
  buyerContact: string,
  propertyName: string,
) => {
  return `
         <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        
        <p style="margin-top: 3px;">Dear Owner,</p>
        
        <p style="margin-top: 5px;">
          You have received a new inquiry for your property <strong>${propertyName}</strong>.
        </p>
        
  
        <div style="border: 1px solid #ddd; padding: 15px; background-color: #ededed; border-radius: 5px; margin-top: 15px;">
          <h3 style="margin-top: 0; padding-bottom: 1px; border-bottom: 1px solid #eee;">Inquiry Details</h3>
        <hr style="border-top: 1px solid #a6a6a6; margin: 15px 0;" />
          <p style="margin: 10px 0;">
            <strong>Name:</strong> ${buyerName}
          </p>
          <p style="margin: 10px 0;">
            <strong>Email:</strong> <a href="mailto:${buyerEmail}" style="color: #007bff;">${buyerEmail}</a>
          </p>
          <p style="margin: 10px 0;">
            <strong>Contact:</strong> <a href="tel:${buyerContact}" style="color: #007bff;">${buyerContact}</a>
          </p>
        </div>
  
        <hr style="border-top: 1px solid #ddd; margin: 20px 0;" />
        
        <p>
          Please check your dashboard to view the full details of the inquiry and respond to the buyer accordingly.
        </p>
        
        <p style="margin-top: 20px;">Best regards,<br><strong>House Hub Team</strong></p>
        
        <hr style="border-top: 1px solid #eee; margin-top: 20px;" />
        
        <p style="font-size: 12px; color: #999;">
          This email is intended for the owner of <strong>${propertyName}</strong>. If you are not the intended recipient, please disregard this email.
        </p>
      </div>
      `;
};
