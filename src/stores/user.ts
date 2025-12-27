import { create } from 'zustand';

interface UserState {
    fullName: string | null;
    avatarUrl: string | null;
    email: string | null;
    tier: string | null;
    isLoaded: boolean;
    setUserInfo: (info: { fullName?: string | null; avatarUrl?: string | null; tier?: string | null; email?: string | null }) => void;
    fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
    fullName: null,
    avatarUrl: null,
    email: null,
    tier: 'FREE',
    isLoaded: false,
    setUserInfo: (info) => set((state) => ({ ...state, ...info, isLoaded: true })),
    fetchUser: async () => {
        try {
            const response = await fetch('/api/settings');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.user) {
                    set({
                        fullName: data.user.fullName,
                        avatarUrl: data.user.avatarUrl,
                        email: data.user.email,
                        tier: data.user.tier,
                        isLoaded: true,
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch user in store:', error);
        }
    }
}));
