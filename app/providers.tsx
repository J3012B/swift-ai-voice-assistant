'use client';

import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import type { Session } from '@supabase/supabase-js';

interface ProvidersProps {
    initialSession?: Session | null;
    children: React.ReactNode;
}

export default function Providers({ children, initialSession }: ProvidersProps) {
    const [supabaseClient] = useState(() => createBrowserSupabaseClient());

    return (
        <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
            {children}
        </SessionContextProvider>
    );
}