import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET unread message count
export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const count = await prisma.message.count({
      where: {
        senderId: { not: authUser.userId },
        read: false,
        booking: authUser.role === 'STUDENT' 
          ? { studentId: authUser.userId }
          : { listing: { hostId: authUser.userId } },
      },
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('Get unread count error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

