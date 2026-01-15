
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const POST = async (request: NextRequest) => {
    try {
        const contentType = request.headers.get("content-type") || "";
        let body;

        if (contentType.includes("multipart/form-data")) {
            body = await request.formData();
        } else {
            body = await request.json();
        }

        const res = await api.post("/auth/signup", body, {
            headers: { 'Content-Type': contentType }
        });

        // Any status code returned by the backend (2xx, 4xx, etc) is handled here thanks to validateStatus
        if (res.status < 500) {
            return NextResponse.json(res.data, { status: res.status });
        } else return NextResponse.json({ error: res.data }, { status: 502 });

    } catch (e: any) {
        console.error("BFF Signup Error:", e);
        return NextResponse.json(
            { error: "Error en el servidor, favor intentelo más tarde" },
            { status: 500 }
        );
    }
};

export { POST };
