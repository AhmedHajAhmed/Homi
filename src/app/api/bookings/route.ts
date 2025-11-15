import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all bookings for current user
export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let bookings;

    if (authUser.role === 'STUDENT') {
      // Get bookings made by this student
      bookings = await prisma.booking.findMany({
        where: { studentId: authUser.userId },
        include: {
          listing: {
            include: {
              host: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Get bookings for this host's listings
      bookings = await prisma.booking.findMany({
        where: {
          listing: {
            hostId: authUser.userId,
          },
        },
        include: {
          listing: true,
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              bio: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create booking
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (authUser.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Only students can create booking requests' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { listingId, checkIn, checkOut, guests, message } = body;

    // Validation
    if (!listingId || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Check if student is trying to book their own listing (shouldn't happen)
    if (listing.hostId === authUser.userId) {
      return NextResponse.json(
        { error: 'You cannot book your own listing' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        listingId,
        studentId: authUser.userId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: parseInt(guests),
        message: message || null,
        status: 'PENDING',
      },
      include: {
        listing: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

