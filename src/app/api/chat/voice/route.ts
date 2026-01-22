
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;

        // Use fetch directly to handle streaming response from backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/voice`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(errorText, { status: response.status });
        }

        // Return the raw readable stream to the frontend
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (e: unknown) {
        console.error("BFF Voice Chat Error:", e);
        return new Response(JSON.stringify({ error: "Voice chat failed" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export { POST };
