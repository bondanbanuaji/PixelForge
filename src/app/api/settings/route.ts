import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export interface UserPreferences {
    defaultScaleFactor: 2 | 4 | 8;
    defaultQualityMode: 'fast' | 'balanced' | 'quality';
    defaultAlgorithm: 'lanczos3' | 'mitchell' | 'cubic' | 'realesrgan';
    theme: 'dark' | 'light' | 'system';
}

// GET - Fetch user settings
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const clerkUser = await currentUser();

        // Try to find existing user in DB
        const existingUsers = await db.select()
            .from(users)
            .where(eq(users.userId, userId));

        let userData = existingUsers[0];

        // If user doesn't exist, create them
        if (!userData) {
            const defaultPreferences: UserPreferences = {
                defaultScaleFactor: 2,
                defaultQualityMode: 'balanced',
                defaultAlgorithm: 'realesrgan',
                theme: 'dark',
            };

            await db.insert(users).values({
                userId,
                email: clerkUser?.emailAddresses[0]?.emailAddress || 'unknown@email.com',
                fullName: clerkUser?.fullName || clerkUser?.firstName || 'User',
                avatarUrl: clerkUser?.imageUrl,
                totalProcessed: 0,
                storageUsedBytes: 0,
                tier: 'FREE',
                preferences: defaultPreferences,
            });

            // Fetch the newly created user
            const newUsers = await db.select()
                .from(users)
                .where(eq(users.userId, userId));
            userData = newUsers[0];
        }

        return NextResponse.json({
            success: true,
            user: {
                userId: userData.userId,
                email: userData.email,
                fullName: userData.fullName,
                avatarUrl: userData.avatarUrl || clerkUser?.imageUrl,
                tier: userData.tier,
                totalProcessed: userData.totalProcessed,
                storageUsedBytes: userData.storageUsedBytes,
                preferences: userData.preferences as UserPreferences || {
                    defaultScaleFactor: 2,
                    defaultQualityMode: 'balanced',
                    defaultAlgorithm: 'realesrgan',
                    theme: 'dark',
                },
                createdAt: userData.createdAt,
            }
        });
    } catch (error) {
        console.error('Settings GET error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

// PUT - Update user settings
export async function PUT(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { preferences, fullName } = body;

        // Validate preferences
        if (preferences) {
            const validScaleFactors = [2, 4, 8];
            const validQualityModes = ['fast', 'balanced', 'quality'];
            const validAlgorithms = ['lanczos3', 'mitchell', 'cubic', 'realesrgan'];
            const validThemes = ['dark', 'light', 'system'];

            if (preferences.defaultScaleFactor && !validScaleFactors.includes(preferences.defaultScaleFactor)) {
                return NextResponse.json({ error: 'Invalid scale factor' }, { status: 400 });
            }
            if (preferences.defaultQualityMode && !validQualityModes.includes(preferences.defaultQualityMode)) {
                return NextResponse.json({ error: 'Invalid quality mode' }, { status: 400 });
            }
            if (preferences.defaultAlgorithm && !validAlgorithms.includes(preferences.defaultAlgorithm)) {
                return NextResponse.json({ error: 'Invalid algorithm' }, { status: 400 });
            }
            if (preferences.theme && !validThemes.includes(preferences.theme)) {
                return NextResponse.json({ error: 'Invalid theme' }, { status: 400 });
            }
        }

        // Get current user data
        const existingUsers = await db.select()
            .from(users)
            .where(eq(users.userId, userId));

        if (!existingUsers[0]) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const currentPreferences = existingUsers[0].preferences as UserPreferences || {};

        // Merge preferences
        const updatedPreferences = {
            ...currentPreferences,
            ...preferences,
        };

        // Update user
        const updateData: Record<string, unknown> = {
            preferences: updatedPreferences,
        };

        if (fullName) {
            updateData.fullName = fullName;
        }

        await db.update(users)
            .set(updateData)
            .where(eq(users.userId, userId));

        return NextResponse.json({
            success: true,
            message: 'Settings saved successfully',
            preferences: updatedPreferences,
        });
    } catch (error) {
        console.error('Settings PUT error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to save settings' },
            { status: 500 }
        );
    }
}

// DELETE - Clear user history
export async function DELETE() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Reset user stats
        await db.update(users)
            .set({
                totalProcessed: 0,
                storageUsedBytes: 0,
            })
            .where(eq(users.userId, userId));

        return NextResponse.json({
            success: true,
            message: 'History cleared successfully',
        });
    } catch (error) {
        console.error('Settings DELETE error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to clear history' },
            { status: 500 }
        );
    }
}
