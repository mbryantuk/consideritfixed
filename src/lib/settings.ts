import { prisma } from "./prisma";
import { cache } from "react";

export interface SiteSettings {
  siteName?: string;
  siteTagline?: string;
  phoneNumber?: string;
  phoneTel?: string;
  whatsappNumber?: string;
  contactEmail?: string;
  businessAddress?: string;
  servingSince?: string;
  metaTitle?: string;
  metaDescription?: string;
  showCalendar?: 'on' | 'off';
  holidayMode?: 'on' | 'off';
  holidayMessage?: string;
  homeHeroImage?: string;
  serviceHeroImage?: string;
  aboutHeroImage?: string;
  aboutPicture?: string;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutContent?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  nextdoorUrl?: string;
  [key: string]: string | undefined;
}

export async function getSetting(key: string, defaultValue: string = ""): Promise<string> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key }
  });
  return setting?.value || defaultValue;
}

export const getAllSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await prisma.siteSetting.findMany();
  return settings.reduce((acc: SiteSettings, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
});