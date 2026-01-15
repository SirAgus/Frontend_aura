import { useRef, useState, useEffect } from 'react';

export const useAudioQueue = (token: string | null) => {
    const queue = useRef<string[]>([]);
    const isPlayingRef = useRef(false);
    const [isAuraSpeaking, setIsAuraSpeaking] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const addToQueue = (url: string) => {
        if (!url) return;
        queue.current.push(url);
        if (!isPlayingRef.current) {
            playNext();
        }
    };

    const playNext = async () => {
        if (queue.current.length === 0) {
            isPlayingRef.current = false;
            setIsAuraSpeaking(false);
            return;
        }

        // Si es Data URI, no necesitamos token. Si es URL remota, sí.
        const nextUrl = queue.current.shift();
        if (!nextUrl) return;

        const isDataUri = nextUrl.startsWith('data:');

        if (!isDataUri && !token) {
            // Solo requerimos token para URLs remotas protegidas
            console.warn("useAudioQueue: No token available yet.");
            queue.current.unshift(nextUrl); // Devolver a la cola
            setTimeout(playNext, 100);
            return;
        }

        isPlayingRef.current = true;
        setIsAuraSpeaking(true);

        try {
            let audioToPlay: HTMLAudioElement;
            let blobUrlToRevoke: string | null = null;

            if (isDataUri) {
                // Caso A: Data URI (Base64) - Reproducción directa instantánea
                console.log("useAudioQueue: Playing Data URI audio");
                audioToPlay = new Audio(nextUrl);
            } else {
                // Caso B: URL Remota - Fetch con auth
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const fullUrl = nextUrl.startsWith('http') ? nextUrl : `${baseUrl}${nextUrl}`;

                console.log(`useAudioQueue: Fetching audio from ${fullUrl}`);
                const response = await fetch(fullUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'audio/mpeg, audio/wav, audio/*, */*'
                    }
                });

                if (!response.ok) throw new Error(`Audio fetch failed ${response.status}`);
                const blob = await response.blob();
                const audioUrl = URL.createObjectURL(blob);
                blobUrlToRevoke = audioUrl;
                audioToPlay = new Audio(audioUrl);
            }

            audioRef.current = audioToPlay;

            audioToPlay.onended = () => {
                if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
                playNext();
            };

            audioToPlay.onerror = (e) => {
                console.error("useAudioQueue: Audio error", e);
                if (blobUrlToRevoke) URL.revokeObjectURL(blobUrlToRevoke);
                playNext();
            };

            await audioToPlay.play();
        } catch (e) {
            console.error("useAudioQueue: Execution failed", e);
            isPlayingRef.current = false;
            setIsAuraSpeaking(false);
            setTimeout(playNext, 100);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return { addToQueue, isPlaying: isAuraSpeaking };
};
