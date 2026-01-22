
import { NextResponse } from "next/server";
import api from "@/lib/services/api";
import axios from "axios";

const GET = async () => {
    try {
        const res = await api.get("/history");
        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
            if (e.response?.status === 404) return NextResponse.json([], { status: 200 });
            if (e.response) return NextResponse.json({ error: e.response.data }, { status: e.response.status });
        }
        return NextResponse.json({ error: "History failed" }, { status: 500 });
    }
};

export { GET };
