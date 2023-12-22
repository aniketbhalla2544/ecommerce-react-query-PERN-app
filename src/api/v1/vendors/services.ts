import bcrypt from 'bcrypt';
import crypto from 'crypto';
import type { Prisma } from '@prisma/client';
import prismaClient from '../../../prisma/prismaClientInstance';
import { CreateVendor } from '../../../validation-schemas/vendor/create';
import createHttpError from 'http-errors';

export const vendorServices = {
  createVendor,
  getVendor,
  getVendorById,
  getVendorByEmail,
};

// createVendor ---------------------
async function createVendor(data: CreateVendor) {
  const { email, fullname, password } = data;
  const vendorSlug = createVendorSlug(email);
  const hashPassword = await hashVendorPassword(password, email);
  const newVendor = await prismaClient.vendor.create({
    data: {
      vendorSlug,
      email,
      fullname,
      password: hashPassword,
    },
  });
  console.log(
    `New vendor registered in the records with id: ${newVendor.id} and email: ${newVendor.email}`
  );
  return newVendor;
}

// getVendor ---------------------
type GetVendorArgs = {
  where: Prisma.VendorWhereUniqueInput;
};

async function getVendor({ where }: GetVendorArgs) {
  return await prismaClient.vendor.findUnique({
    where,
  });
}

// getVendorByEmail ---------------------
async function getVendorByEmail(email: string) {
  return await prismaClient.vendor.findUnique({
    where: {
      email,
    },
  });
}

// getVendorById ---------------------
async function getVendorById(id: number) {
  return await prismaClient.vendor.findUnique({
    where: {
      id,
    },
  });
}

// -------------- private services

// removes anything other than alphanumerics, hyphens, underscores
function sanitizeVendorEmailInput(email: string) {
  return email.split('@')[0].replace(/[^a-zA-Z0-9-_]/g, '');
}

function createVendorSlug(email: string) {
  const sanitizedEmail = sanitizeVendorEmailInput(email);
  const randomString = crypto.randomBytes(10).toString('hex').substring(0, 10);
  const randomDigits = String(Date.now()).substring(0, 5);
  const vendorSlug = `${sanitizedEmail}_${randomString}${randomDigits}`;
  return vendorSlug;
}

async function hashVendorPassword(password: string, email: string) {
  try {
    const saltRounds = 5;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(`Error while hashing vendor password for vendor with email: ${email}`);
    throw createHttpError(500, 'Error while registering vendor');
  }
}
