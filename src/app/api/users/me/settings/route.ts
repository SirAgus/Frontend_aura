
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const PATCH = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const res = await api.patch("/users/me/settings", body);

        if (res.status < 500) {
            return NextResponse.json(res.data, { status: res.status });
        } else {
            return NextResponse.json({ error: res.data }, { status: 502 });
        }
    } catch (e: any) {
        console.error("BFF Settings Update Error:", e);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
};

export { PATCH };
