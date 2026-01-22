
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const res = await api.delete(`/threads/${id}`);
        if (res.status < 500) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: 502 });
        }
    } catch (e: unknown) {
        console.error("BFF Delete Thread Error:", e);
        return NextResponse.json({ error: "Delete thread failed" }, { status: 500 });
    }
};

const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const body = await req.json(); // Expected { title: "new title" }

        const res = await api.patch(`/threads/${id}`, body);

        if (res.status < 500) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: 502 });
        }
    } catch (e: unknown) {
        console.error("BFF Update Thread Error:", e);
        return NextResponse.json({ error: "Update thread failed" }, { status: 500 });
    }
};

export { DELETE, PATCH };
