
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";
import axios from "axios";

const DELETE = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const res = await api.delete(`/voices/${id}`);
        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            if (e.response) return NextResponse.json({ error: e.response.data }, { status: e.response.status });
        }
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
};

const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const searchParams = req.nextUrl.searchParams;
        const res = await api.put(`/voices/${id}?${searchParams.toString()}`);
        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            if (e.response) return NextResponse.json({ error: e.response.data }, { status: e.response.status });
        }
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
};

export { DELETE, PUT };
