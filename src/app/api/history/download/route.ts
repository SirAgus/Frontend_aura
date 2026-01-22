
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
        return NextResponse.json({ error: "Filename required" }, { status: 400 });
    }

    try {
        const res = await api.get(`/download/${filename}`, {
            responseType: 'arraybuffer'
        });

        if (res.status === 200) {
            return new NextResponse(res.data, {
                status: 200,
                headers: {
                    "Content-Type": "audio/wav",
                    "Content-Disposition": `attachment; filename="${filename}"`
                }
            });
        } else {
            return NextResponse.json({ error: "Download failed" }, { status: res.status });
        }
    } catch (e: unknown) {
        console.error("Proxy download error:", e);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
};

export { GET };
