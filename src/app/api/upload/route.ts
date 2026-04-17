import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const canUseBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: 'File must be an image or video' },
        { status: 400 }
      );
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: isVideo ? 'Video size must be less than 50MB' : 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const filename = `${uuidv4()}.${ext}`;

    if (canUseBlobStorage) {
      const blob = await put(`uploads/${category}/${filename}`, file, {
        access: 'public',
        addRandomSuffix: false,
        contentType: file.type,
        multipart: isVideo || file.size > 5 * 1024 * 1024,
      });

      return NextResponse.json(
        {
          success: true,
          path: blob.url,
          filename,
        },
        { status: 201 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create category directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public/uploads', category);
    await mkdir(uploadsDir, { recursive: true });

    // Save file
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    // Return the relative path for use in the database
    const relativePath = `/uploads/${category}/${filename}`;

    return NextResponse.json(
      {
        success: true,
        path: relativePath,
        filename: filename
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
