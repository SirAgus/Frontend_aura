
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();

        const res = await api.post("/generate-tts", formData, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (res.status === 200 || res.status === 201) {
            // Return binary
            return new NextResponse(res.data, {
                status: res.status,
                headers: { 'Content-Type': 'audio/wav' } // Adjust if mp3
            });
        } else {
            return NextResponse.json({ error: "TTS Generation Failed" }, { status: res.status });
        }
    } catch (e: any) {
        console.error("TTS Error", e);
        if (e.response) return NextResponse.json({ error: e.response.data || "Error" }, { status: e.response.status });
        return NextResponse.json({ error: "TTS failed" }, { status: 500 });
    }
};

export { POST };
