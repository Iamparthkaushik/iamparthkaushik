import { NextRequest, NextResponse } from 'next/server';
import { getMessages, addMessage } from '@/lib/db';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export async function GET() {
  try {
    const messages = getMessages(50);

    return NextResponse.json({
      messages: messages.map((msg) => ({
        id: msg.id,
        content: msg.content,
        username: msg.username,
        date: msg.created_at,
      })),
    });
  } catch (error) {
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      );
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Message is too long (max 500 characters)' },
        { status: 400 }
      );
    }

    addMessage(payload.userId, content.trim());

    return NextResponse.json({
      success: true,
      message: 'Message posted successfully',
    });
  } catch (error) {
    console.error('Message post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
