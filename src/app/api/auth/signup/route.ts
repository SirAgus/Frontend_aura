import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const POST = async (request: NextRequest) => {
    try {
        const userInfo = await request.json();
        const res = await api.post("/auth/signup/", userInfo);

        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }

    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Error en el servidor, favor intentelo más tarde" },
            { status: 500 }
        );
    }
};

export { POST };
