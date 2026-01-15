
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const res = await api.delete(`/threads/${id}`);
        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: any) {
        if (e.response) return NextResponse.json({ error: e.response.data }, { status: e.response.status });
        return NextResponse.json({ error: "Delete thread failed" }, { status: 500 });
    }
};

export { DELETE };
