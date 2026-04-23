import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { AuthError, PermissionError, assertAdminPermission } from '@/lib/admin-auth';

const canUseBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const canUseImageKit = Boolean(process.env.IMAGEKIT_PRIVATE_KEY) && Boolean(process.env.IMAGEKIT_PUBLIC_KEY) && Boolean(process.env.IMAGEKIT_URL_ENDPOINT);

const uploadPermissions = {
  blog: 'blog',
  events: 'events',
  gallery: 'gallery',
  pages: 'pages',
  programs: 'programs',
  team: 'team',
} as const;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'general';

    const requiredPermission = uploadPermissions[category as keyof typeof uploadPermissions];

    if (!requiredPermission) {
      return NextResponse.json(
        { error: 'Unknown upload category' },
        { status: 400 }
      );
    }

    await assertAdminPermission(requiredPermission);

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

    if (canUseImageKit) {
      const formDataIK = new FormData();
      formDataIK.append('file', file, filename);
      formDataIK.append('fileName', filename);
      formDataIK.append('folder', `/uploads/${category}`);
      formDataIK.append('useUniqueFileName', 'false');

      const credentials = Buffer.from(`${process.env.IMAGEKIT_PRIVATE_KEY}:`).toString('base64');
      const ikResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${credentials}`,
        },
        body: formDataIK,
      });

      if (!ikResponse.ok) {
        const err = await ikResponse.text();
        console.error('ImageKit upload error:', err);
        return NextResponse.json({ error: 'ImageKit upload failed' }, { status: 500 });
      }

      const ikData = await ikResponse.json();

      return NextResponse.json(
        {
          success: true,
          path: ikData.url,
          filename,
        },
        { status: 201 }
      );
    }

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
    if (error instanceof AuthError || error instanceof PermissionError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
