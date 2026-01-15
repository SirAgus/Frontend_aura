import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const GET = async (req: NextRequest, { params }: { params: Promise<{ threadId: string }> }) => {
    try {
        const { threadId } = await params;
        const res = await api.get(`/threads/${threadId}/messages`);

        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: "Fetch messages failed" }, { status: 500 });
    }
};

export { GET };
