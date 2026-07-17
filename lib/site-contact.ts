export const siteContact = {
  phone: '+989917175937',
  email: 'arianbussineskh@gmail.com',
} as const;

export function getTelephoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
