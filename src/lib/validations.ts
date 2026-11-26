import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  businessName: z.string().optional(),
  consentGiven: z.literal(true, {
    message: 'You must agree to the GDPR Privacy Notice to register',
  }),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const applicationSchema = z.object({
  businessName: z.string().min(2, 'Business name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Valid UK or international phone number is required'),
  category: z.enum([
    'German Specialities',
    'Food & Drink',
    'Artisan Crafts',
    'Gifts & Decor',
  ]),
  chaletSize: z.string().min(3, 'Please select a chalet package'),
  zoneId: z.string().min(1, 'Please select a preferred market zone'),
  description: z.string().min(15, 'Please describe your products in at least 15 characters'),
  hygieneCertRef: z.string().optional(),
  gdprConsent: z.literal(true, {
    message: 'GDPR consent is required to process your application',
  }),
});

export const stallSchema = z.object({
  name: z.string().min(2, 'Stall name is required'),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  chaletNumber: z.string().min(1, 'Chalet number is required'),
  priceRange: z.enum(['£', '££', '£££']),
  zoneId: z.string().min(1, 'Zone is required'),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Event title is required'),
  description: z.string().min(10, 'Description is required'),
  eventDate: z.string().min(1, 'Event date and time is required'),
  category: z.string().min(2, 'Category is required'),
  zoneId: z.string().min(1, 'Zone is required'),
});