/**
 * ============================================================================
 * MINDKATHA — GOOGLE CALENDAR BLOCKER & INSTANT NOTIFICATION WEBHOOK
 * Account: psychotherapy.leona@gmail.com (100% Free, Zero Credit Card Needed)
 * ============================================================================
 *
 * IMPORTANT DEPLOYMENT SETTING (Fixes 403 Forbidden):
 * 1. In https://script.google.com, click "Deploy" -> "Manage deployments"
 * 2. Click the Pencil icon (Edit) -> Version: "New version"
 * 3. Set "Execute as": "Me (psychotherapy.leona@gmail.com)"
 * 4. Set "Who has access": "Anyone"  <-- MUST BE "Anyone" (NOT "Only myself")
 * 5. Click "Deploy"
 */

const PRACTICE_EMAIL = 'psychotherapy.leona@gmail.com';
const TIMEZONE = 'Asia/Kolkata';

// Map of website slot labels to 24-hour IST start times
const SLOT_START_HOURS = {
  '03:00 PM': 15,
  '04:00 PM': 16,
  '05:00 PM': 17,
  '07:00 PM': 19,
  '08:00 PM': 20,
  '09:00 PM': 21
};

/**
 * GET Handler:
 * Supports BOTH:
 * 1. `?action=getBusySlots&start=YYYY-MM-DD&end=YYYY-MM-DD`
 * 2. `?action=createBooking&clientName=...` (so browser 302 redirects never drop POST bodies)
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};

    if (params.action === 'createBooking') {
      return handleCreateBooking(params);
    }

    const startParam = params.start;
    const endParam = params.end;

    const startDate = startParam ? new Date(startParam + 'T00:00:00+05:30') : new Date();
    const endDate = endParam
      ? new Date(endParam + 'T23:59:59+05:30')
      : new Date(startDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const calendar = CalendarApp.getDefaultCalendar();
    const events = calendar.getEvents(startDate, endDate);
    const busySlots = {};

    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const dateStr = Utilities.formatDate(cursor, TIMEZONE, 'yyyy-MM-dd');

      Object.keys(SLOT_START_HOURS).forEach(function (slotLabel) {
        const hour = SLOT_START_HOURS[slotLabel];
        const slotStart = new Date(dateStr + 'T' + String(hour).padStart(2, '0') + ':00:00+05:30');
        const slotEnd = new Date(slotStart.getTime() + 50 * 60 * 1000);

        const hasConflict = events.some(function (ev) {
          if (ev.isAllDayEvent()) return false;
          return ev.getStartTime() < slotEnd && ev.getEndTime() > slotStart;
        });

        if (hasConflict) {
          if (!busySlots[dateStr]) busySlots[dateStr] = [];
          busySlots[dateStr].push(slotLabel);
        }
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    return jsonResponse({ status: 'ok', busySlots: busySlots });
  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) });
  }
}

/**
 * POST Handler:
 * Also delegates to handleCreateBooking(data)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return handleCreateBooking(data);
  } catch (err) {
    return jsonResponse({ status: 'error', message: String(err) });
  }
}

function handleCreateBooking(data) {
  const dateStr = data.date; // 'YYYY-MM-DD'
  const slotLabel = data.slot; // e.g. '03:00 PM'
  const hour = SLOT_START_HOURS[slotLabel] || 15;
  const durationMinutes = Number(data.durationMinutes) || 50;

  const startTime = new Date(dateStr + 'T' + String(hour).padStart(2, '0') + ':00:00+05:30');
  const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);

  const calendar = CalendarApp.getDefaultCalendar();

  // 1. Block Leona's Google Calendar
  const eventTitle = 'MindKatha Session: ' + data.clientName + ' (' + data.slot + ')';
  const eventDescription = [
    'MindKatha Clinical Consultation Request',
    '----------------------------------------',
    'Client Name: ' + data.clientName,
    'WhatsApp / Mobile: ' + data.phoneNumber,
    'Client Email: ' + (data.clientEmail || 'Not provided'),
    'Care Pathway: ' + data.service,
    'Format: ' + data.mode,
    'Date & Time: ' + data.dayLabel + ' at ' + data.slot + ' IST'
  ].join('\n');

  const eventOptions = {
    description: eventDescription,
    location: data.mode
  };

  if (data.clientEmail) {
    eventOptions.guests = data.clientEmail;
    eventOptions.sendInvites = true;
  }

  calendar.createEvent(eventTitle, startTime, endTime, eventOptions);

  // 2. Send Instant Notification Email to Leona (psychotherapy.leona@gmail.com)
  const cleanPhoneDigits = String(data.phoneNumber || '').replace(/\D/g, '');
  const waReplyText = encodeURIComponent(
    'Hi ' + data.clientName + ', this is Leona from MindKatha. Confirming your session request for ' + data.dayLabel + ' at ' + data.slot + ' IST (' + data.mode + ').'
  );
  const waReplyLink = 'https://wa.me/' + cleanPhoneDigits + '?text=' + waReplyText;

  const emailSubject = 'New Booking: ' + data.clientName + ' — ' + data.dayLabel + ' at ' + data.slot + ' IST';
  const emailHtml = [
    '<div style="font-family: Arial, sans-serif; max-width: 560px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; color: #0f172a;">',
    '  <h2 style="margin: 0 0 8px; color: #0284c7;">New MindKatha Session Booked</h2>',
    '  <p style="margin: 0 0 16px; font-size: 14px; color: #475569;">Your Google Calendar has been automatically blocked for this slot.</p>',
    '  <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">',
    '    <tr><td style="padding: 8px 0; color: #64748b;"><strong>Client Name:</strong></td><td style="padding: 8px 0;">' + data.clientName + '</td></tr>',
    '    <tr><td style="padding: 8px 0; color: #64748b;"><strong>WhatsApp / Mobile:</strong></td><td style="padding: 8px 0;">' + data.phoneNumber + '</td></tr>',
    '    <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email:</strong></td><td style="padding: 8px 0;">' + (data.clientEmail || '—') + '</td></tr>',
    '    <tr><td style="padding: 8px 0; color: #64748b;"><strong>Date & Time:</strong></td><td style="padding: 8px 0;"><strong>' + data.dayLabel + ' • ' + data.slot + ' IST</strong></td></tr>',
    '    <tr><td style="padding: 8px 0; color: #64748b;"><strong>Format:</strong></td><td style="padding: 8px 0;">' + data.mode + '</td></tr>',
    '    <tr><td style="padding: 8px 0; color: #64748b;"><strong>Care Pathway:</strong></td><td style="padding: 8px 0;">' + data.service + '</td></tr>',
    '  </table>',
    '  <a href="' + waReplyLink + '" style="display: inline-block; padding: 12px 20px; background: #0284c7; color: #ffffff; text-decoration: none; border-radius: 999px; font-weight: bold; font-size: 13px;">Message ' + data.clientName + ' on WhatsApp</a>',
    '</div>'
  ].join('\n');

  MailApp.sendEmail({
    to: PRACTICE_EMAIL,
    subject: emailSubject,
    htmlBody: emailHtml
  });

  // 3. Also send Confirmation Email to Client (if clientEmail was entered)
  if (data.clientEmail && data.clientEmail.indexOf('@') !== -1) {
    const clientSubject = 'MindKatha Session Request Received — ' + data.dayLabel + ' at ' + data.slot + ' IST';
    const clientHtml = [
      '<div style="font-family: Arial, sans-serif; max-width: 560px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; color: #0f172a;">',
      '  <h2 style="margin: 0 0 8px; color: #0284c7;">We Have Received Your Session Request</h2>',
      '  <p style="margin: 0 0 16px; font-size: 14px; color: #475569;">Hi ' + data.clientName + ', thank you for booking with MindKatha. Your preferred slot has been reserved on Leona\'s calendar:</p>',
      '  <p style="margin: 0 0 16px; font-size: 14px;"><strong>Date & Time:</strong> ' + data.dayLabel + ' at ' + data.slot + ' IST<br/>',
      '  <strong>Format:</strong> ' + data.mode + '<br/>',
      '  <strong>Care Pathway:</strong> ' + data.service + '</p>',
      '  <p style="margin: 0; font-size: 13px; color: #64748b;">Our practice will reach out to you on WhatsApp (' + data.phoneNumber + ') shortly to finalize your session.</p>',
      '</div>'
    ].join('\n');

    MailApp.sendEmail({
      to: data.clientEmail,
      subject: clientSubject,
      htmlBody: clientHtml
    });
  }

  return jsonResponse({ status: 'ok', message: 'Calendar blocked and emails sent.' });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
