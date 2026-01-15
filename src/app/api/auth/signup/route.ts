
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

        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }

    } catch (e: any) {
        console.error("BFF Signup Error:", e);
        return NextResponse.json(
            { error: "Error en el servidor, favor intentelo más tarde" },
            { status: 500 }
        );
    }
};

export { POST };
