
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const res = await api.post("/messages/", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: unknown) {
        console.error(e);
        return NextResponse.json({ error: "Send message failed" }, { status: 500 });
    }
};

export { POST };
