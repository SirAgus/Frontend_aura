import { NextResponse } from "next/server";
import api from "@/lib/services/api";

const GET = async () => {
    try {
        const res = await api.get("/");
        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: unknown) {
        console.error(e);
        return NextResponse.json({ error: "System info unavailable" }, { status: 500 });
    }
};

export { GET };
