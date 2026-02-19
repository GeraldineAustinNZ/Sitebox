interface BookingConfirmationData {
  customerName: string;
  bookingReference: string;
  startDate: string;
  endDate: string;
  deliveryAddress: string;
  totalPrice: number;
  weeklyRate: number;
  deliveryFee: number;
  pickupFee: number;
  addonsCost: number;
  durationWeeks: number;
  hasPremiumLock: boolean;
  hasWheelClamp: boolean;
  hasGpsSecurity: boolean;
}

interface ReminderData {
  customerName: string;
  bookingReference: string;
  date: string;
  address: string;
  type: 'delivery' | 'pickup';
}

export function getBookingConfirmationEmail(data: BookingConfirmationData): { subject: string; html: string } {
  const addons = [];
  if (data.hasPremiumLock) addons.push('Premium Security Lock');
  if (data.hasWheelClamp) addons.push('Wheel Clamp');
  if (data.hasGpsSecurity) addons.push('GPS Security Tracker');

  const addonsHtml = addons.length > 0
    ? `<p><strong>Add-ons:</strong> ${addons.join(', ')}</p>`
    : '';

  return {
    subject: `Booking Confirmation - ${data.bookingReference}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Booking Confirmed!</h1>
  </div>

  <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 18px; margin-top: 0;">Hi ${data.customerName},</p>

    <p>Thank you for booking with us! Your mobile storage trailer is confirmed and ready for delivery.</p>

    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #059669;">
      <h2 style="color: #059669; margin-top: 0; font-size: 20px;">Booking Details</h2>
      <p style="margin: 10px 0;"><strong>Booking Reference:</strong> ${data.bookingReference}</p>
      <p style="margin: 10px 0;"><strong>Delivery Date:</strong> ${new Date(data.startDate).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p style="margin: 10px 0;"><strong>Pickup Date:</strong> ${new Date(data.endDate).toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p style="margin: 10px 0;"><strong>Delivery Address:</strong> ${data.deliveryAddress}</p>
      <p style="margin: 10px 0;"><strong>Duration:</strong> ${data.durationWeeks} week${data.durationWeeks !== 1 ? 's' : ''}</p>
      ${addonsHtml}
    </div>

    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #059669; margin-top: 0; font-size: 20px;">Pricing Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px 0;">Weekly Rate (${data.durationWeeks} week${data.durationWeeks !== 1 ? 's' : ''})</td>
          <td style="text-align: right; padding: 10px 0;">$${(data.weeklyRate * data.durationWeeks).toFixed(2)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px 0;">Delivery Fee</td>
          <td style="text-align: right; padding: 10px 0;">$${data.deliveryFee.toFixed(2)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px 0;">Pickup Fee</td>
          <td style="text-align: right; padding: 10px 0;">$${data.pickupFee.toFixed(2)}</td>
        </tr>
        ${data.addonsCost > 0 ? `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 10px 0;">Add-ons</td>
          <td style="text-align: right; padding: 10px 0;">$${data.addonsCost.toFixed(2)}</td>
        </tr>
        ` : ''}
        <tr style="font-weight: bold; font-size: 18px; color: #059669;">
          <td style="padding: 15px 0 0 0;">Total Paid</td>
          <td style="text-align: right; padding: 15px 0 0 0;">$${data.totalPrice.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Important Reminders:</p>
      <ul style="margin: 10px 0; padding-left: 20px; color: #92400e;">
        <li>We'll send you a reminder 2 days before delivery</li>
        <li>We'll send you a reminder 2 days before pickup</li>
        <li>Please ensure the delivery location is accessible</li>
        <li>Someone must be present during delivery and pickup</li>
      </ul>
    </div>

    <p>If you have any questions or need to modify your booking, please contact us with your booking reference number.</p>

    <p style="margin-bottom: 0;">Thank you for choosing our service!</p>
    <p style="margin-top: 5px; font-weight: 600; color: #059669;">The Team</p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p>This is an automated confirmation email. Please keep this for your records.</p>
  </div>
</body>
</html>
    `,
  };
}

export function getDeliveryReminderEmail(data: ReminderData): { subject: string; html: string } {
  const dateFormatted = new Date(data.date).toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    subject: `Reminder: Trailer Delivery Tomorrow - ${data.bookingReference}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delivery Reminder</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Delivery Reminder</h1>
  </div>

  <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 18px; margin-top: 0;">Hi ${data.customerName},</p>

    <p>This is a friendly reminder that your mobile storage trailer will be delivered tomorrow!</p>

    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #059669;">
      <h2 style="color: #059669; margin-top: 0; font-size: 20px;">Delivery Information</h2>
      <p style="margin: 10px 0;"><strong>Booking Reference:</strong> ${data.bookingReference}</p>
      <p style="margin: 10px 0;"><strong>Delivery Date:</strong> ${dateFormatted}</p>
      <p style="margin: 10px 0;"><strong>Delivery Address:</strong> ${data.address}</p>
    </div>

    <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: 600; color: #1e40af;">Please Ensure:</p>
      <ul style="margin: 10px 0; padding-left: 20px; color: #1e40af;">
        <li>The delivery location is clear and accessible</li>
        <li>Someone is present to receive the trailer</li>
        <li>There's adequate space for the delivery vehicle to maneuver</li>
        <li>Any gates or entry points are unlocked</li>
      </ul>
    </div>

    <p>We'll contact you on the day of delivery to confirm our arrival time.</p>

    <p>If you need to reschedule or have any questions, please contact us immediately with your booking reference.</p>

    <p style="margin-bottom: 0;">See you tomorrow!</p>
    <p style="margin-top: 5px; font-weight: 600; color: #059669;">The Team</p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p>This is an automated reminder email.</p>
  </div>
</body>
</html>
    `,
  };
}

export function getPickupReminderEmail(data: ReminderData): { subject: string; html: string } {
  const dateFormatted = new Date(data.date).toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    subject: `Reminder: Trailer Pickup Tomorrow - ${data.bookingReference}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pickup Reminder</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #059669; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Pickup Reminder</h1>
  </div>

  <div style="background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
    <p style="font-size: 18px; margin-top: 0;">Hi ${data.customerName},</p>

    <p>This is a friendly reminder that we'll be picking up your mobile storage trailer tomorrow!</p>

    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #059669;">
      <h2 style="color: #059669; margin-top: 0; font-size: 20px;">Pickup Information</h2>
      <p style="margin: 10px 0;"><strong>Booking Reference:</strong> ${data.bookingReference}</p>
      <p style="margin: 10px 0;"><strong>Pickup Date:</strong> ${dateFormatted}</p>
      <p style="margin: 10px 0;"><strong>Pickup Address:</strong> ${data.address}</p>
    </div>

    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-weight: 600; color: #92400e;">Please Ensure:</p>
      <ul style="margin: 10px 0; padding-left: 20px; color: #92400e;">
        <li>All your belongings are removed from the trailer</li>
        <li>The trailer is empty and clean</li>
        <li>Someone is present for the pickup</li>
        <li>The trailer location is accessible</li>
        <li>Any security devices (locks, clamps) are removed</li>
      </ul>
    </div>

    <p>We'll contact you on the day of pickup to confirm our arrival time.</p>

    <p>If you need to extend your booking or have any questions, please contact us immediately with your booking reference.</p>

    <p style="margin-bottom: 0;">Thank you for using our service!</p>
    <p style="margin-top: 5px; font-weight: 600; color: #059669;">The Team</p>
  </div>

  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
    <p>This is an automated reminder email.</p>
  </div>
</body>
</html>
    `,
  };
}
