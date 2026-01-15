import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const GET = async () => {
    try {
        const res = await api.get("/voices");
        if (res.status === 200 || res.status === 201) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: res.status });
        }
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch voices" }, { status: 500 });
    }
};

export { GET };
