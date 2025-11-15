import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const student1 = await prisma.user.create({
    data: {
      email: 'student@example.com',
      password: hashedPassword,
      name: 'John Student',
      role: 'STUDENT',
      bio: 'Looking for a place to stay during winter break!',
      phone: '555-0101',
    },
  });

  const host1 = await prisma.user.create({
    data: {
      email: 'host@example.com',
      password: hashedPassword,
      name: 'Sarah Host',
      role: 'HOST',
      bio: 'Welcoming family with a cozy home near campus.',
      phone: '555-0202',
    },
  });

  const host2 = await prisma.user.create({
    data: {
      email: 'host2@example.com',
      password: hashedPassword,
      name: 'Mike & Lisa',
      role: 'HOST',
      bio: 'Experienced hosts, happy to accommodate students.',
      phone: '555-0303',
    },
  });

  // Create sample listings
  const listing1 = await prisma.listing.create({
    data: {
      hostId: host1.id,
      title: 'Cozy Room Near Stanford',
      description: 'Private room in a family home, 10 minutes from campus. Includes breakfast and dinner.',
      location: 'Palo Alto, CA',
      price: 45,
      maxGuests: 1,
      amenities: {
        wifi: true,
        parking: true,
        meals: true,
        laundry: true,
      },
      photos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800',
      ],
      availableFrom: new Date('2024-12-15'),
      availableTo: new Date('2025-01-15'),
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      hostId: host2.id,
      title: 'Spacious Home in Berkeley',
      description: 'Large room with private bathroom. Close to UC Berkeley campus and public transport.',
      location: 'Berkeley, CA',
      price: 55,
      maxGuests: 2,
      amenities: {
        wifi: true,
        parking: true,
        meals: false,
        laundry: true,
        privateBathroom: true,
      },
      photos: [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
      ],
      availableFrom: new Date('2024-12-20'),
      availableTo: new Date('2025-01-20'),
    },
  });

  const listing3 = await prisma.listing.create({
    data: {
      hostId: host1.id,
      title: 'Modern Apartment Near Campus',
      description: 'Clean and modern space perfect for students. Walking distance to campus.',
      location: 'Cambridge, MA',
      price: 60,
      maxGuests: 1,
      amenities: {
        wifi: true,
        parking: false,
        meals: true,
        laundry: true,
      },
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      ],
      availableFrom: new Date('2024-12-10'),
      availableTo: new Date('2025-01-25'),
    },
  });

  // Create a sample booking
  const booking1 = await prisma.booking.create({
    data: {
      listingId: listing1.id,
      studentId: student1.id,
      status: 'PENDING',
      checkIn: new Date('2024-12-20'),
      checkOut: new Date('2025-01-05'),
      guests: 1,
      message: 'Hi! I would love to stay with your family during winter break. Looking forward to meeting you!',
    },
  });

  // Create sample messages
  await prisma.message.create({
    data: {
      bookingId: booking1.id,
      senderId: student1.id,
      content: 'Hi! I would love to stay with your family during winter break.',
      read: true,
    },
  });

  await prisma.message.create({
    data: {
      bookingId: booking1.id,
      senderId: host1.id,
      content: 'Hello John! Thank you for your interest. We would be happy to host you!',
      read: false,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log('Sample users created:');
  console.log('- Student: student@example.com / password123');
  console.log('- Host: host@example.com / password123');
  console.log('- Host: host2@example.com / password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

