
import { NextResponse } from "next/server";
import api from "@/lib/services/api";
import axios from "axios";

const GET = async () => {
    try {
        const res = await api.get("/users/me");
        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: unknown) {
        console.error(e);
        if (axios.isAxiosError(e)) {
            if (e.response) {
                return NextResponse.json({ error: e.response.data }, { status: e.response.status });
            }
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};

export { GET };
