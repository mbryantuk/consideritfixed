import { prisma } from "./prisma";

export async function getSetting(key: string, defaultValue: string = ""): Promise<string> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key }
  });
  return setting?.value || defaultValue;
}

export async function getAllSettings() {
  const settings = await prisma.siteSetting.findMany();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  return settings.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});
}