
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";
import axios from "axios";

const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const res = await api.post("/threads/", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            if (e.response) return NextResponse.json({ error: e.response.data }, { status: e.response.status });
        }
        return NextResponse.json({ error: "Create thread failed" }, { status: 500 });
    }
};

export { POST };
