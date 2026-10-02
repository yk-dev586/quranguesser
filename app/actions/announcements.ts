'use server';

import { prisma } from '@/lib/prisma';

export interface AnnouncementRecord {
  id: string;
  title: string;
  body: string;
  type: string;
  createdAt: Date;
}

/** Fetch all active announcements, newest first. */
export async function getActiveAnnouncements(): Promise<AnnouncementRecord[]> {
  const records = await prisma.announcement.findMany({
    where: { active: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, body: true, type: true, createdAt: true },
  });
  return records;
}
