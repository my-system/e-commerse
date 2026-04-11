import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Only initialize Resend if API key is valid
const resend = process.env.RESEND_API_KEY && 
  process.env.RESEND_API_KEY !== 're_your_resend_api_key_here'
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.$queryRaw`
      SELECT * FROM users WHERE email = ${email}
    ` as any[];

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store OTP in verification_tokens table
    await prisma.$queryRaw`
      INSERT INTO verification_tokens (identifier, token, expires, user_id)
      VALUES (${email}, ${otp}, ${expiresAt}, NULL)
      ON CONFLICT (identifier) 
      DO UPDATE SET 
        token = ${otp}, 
        expires = ${expiresAt}
    `;

    // Send OTP email using Resend
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
          <h1 style="color: white; margin: 0; font-size: 32px;">LUXE</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Premium E-Commerce Platform</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for signing up! To complete your registration, please use the following 6-digit verification code:
          </p>
          
          <div style="background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px;">${otp}</span>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 20px;">
            This code will expire in 10 minutes for security reasons.
          </p>
        </div>
        
        <div style="text-align: center; color: #999; font-size: 12px;">
          <p>If you didn't request this verification, please ignore this email.</p>
          <p>© 2024 LUXE. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      if (resend) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'noreply@luxe.com',
          to: email,
          subject: 'Verify Your LUXE Account - OTP Code',
          html: emailContent,
        });
      } else {
        console.warn('Resend API key not configured, skipping email send');
      }
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      
      // Fallback: return OTP for development (remove in production)
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          message: 'OTP generated (development mode)',
          otp: otp, // Only in development
          expiresAt: expiresAt
        });
      }
      
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      expiresAt: expiresAt
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
