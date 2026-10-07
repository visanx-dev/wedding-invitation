/**
 * Utility functions for wedding invitation
 */

export function generateIcsCalendar(params: {
  title: string;
  description: string;
  location: string;
  startDate: string; // YYYYMMDDTHHMMSSZ
  endDate: string; // YYYYMMDDTHHMMSSZ
  fileName?: string;
}) {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Digital Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@wedding-invitation.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART:${params.startDate}`,
    `DTEND:${params.endDate}`,
    `SUMMARY:${params.title}`,
    `DESCRIPTION:${params.description}`,
    `LOCATION:${params.location}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", params.fileName || "Wedding-Calendar-Event.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatNumberTwoDigits(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}
