
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const res = await api.post("/chat", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: any) {
        if (e.response) return NextResponse.json({ error: e.response.data }, { status: e.response.status });
        return NextResponse.json({ error: "Chat failed" }, { status: 500 });
    }
};

export { POST };
