import { NextRequest, NextResponse } from 'next/server';
import { getLeaderboard, addScore, getUserBestScore } from '@/lib/db';
import { verifyToken, getTokenFromHeader } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    const leaderboard = getLeaderboard(game, limit);

    return NextResponse.json({
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        username: entry.username,
        score: entry.score,
        game: entry.game,
        date: entry.created_at,
      })),
    });
  } catch (error) {
    console.error('Leaderboard fetch error:', error);
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

    const { game, score } = await request.json();

    if (!game || score === undefined) {
      return NextResponse.json(
        { error: 'Game and score are required' },
        { status: 400 }
      );
    }

    // Check if this score beats the user's personal best
    const currentBest = getUserBestScore(payload.userId, game);
    let isBetter = false;
    
    if (currentBest.best === null) {
      // No previous score, save this one
      isBetter = true;
    } else if (game === 'reaction') {
      // For reaction game, lower is better
      isBetter = score < currentBest.best;
    } else {
      // For other games, higher is better
      isBetter = score > currentBest.best;
    }

    if (isBetter) {
      addScore(payload.userId, game, score);
      return NextResponse.json({
        success: true,
        message: 'New personal best! Score submitted successfully',
        isNewBest: true,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Score not better than personal best',
      isNewBest: false,
    });
  } catch (error) {
    console.error('Score submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
