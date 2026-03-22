import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const resolvedParams = await params;
  const [width, height] = resolvedParams.params;
  
  // Generate a random seed for variety
  const seed = Math.random().toString(36).substring(7);
  
  // Use picsum.photos for placeholder images
  const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`;
  
  // Fetch the image from picsum
  const response = await fetch(imageUrl);
  
  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to fetch placeholder image' },
      { status: 500 }
    );
  }
  
  const imageBuffer = await response.arrayBuffer();
  
  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=86400', // Cache for 1 day
    },
  });
}
