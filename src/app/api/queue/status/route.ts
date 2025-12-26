import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { imageOperations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const operationId = searchParams.get('id');

    if (!operationId) {
        return NextResponse.json({ error: 'Operation ID required' }, { status: 400 });
    }

    try {
        const operations = await db.select()
            .from(imageOperations)
            .where(eq(imageOperations.id, operationId));

        const operation = operations[0];

        if (!operation) {
            return NextResponse.json({ error: 'Operation not found' }, { status: 404 });
        }

        if (operation.userId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Build the processed URL if processing is completed
        const processedUrl = operation.status === 'completed' && operation.storagePathProcessed
            ? `/processed/${operation.storagePathProcessed.split('/').pop()}`
            : null;

        return NextResponse.json({
            id: operation.id,
            status: operation.status,
            progress: operation.progress ?? 0,
            processedUrl,
            processedSize: operation.processedSizeBytes ?? 0,
            resolutionResult: operation.resolutionResult,
            processingTimeMs: operation.processingTimeMs,
            error: operation.errorMessage
        });
    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
