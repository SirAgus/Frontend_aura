import { NextRequest, NextResponse } from "next/server";

import api from "@/lib/services/api";


const POST = async (request: NextRequest) => {
    try {
        const credentials = await request.json();
        const res = await api.post('/auth/login/', credentials);
        if (res.status === 200) {
            const { access, refresh } = res.data;
            const response = NextResponse.json("Success", { status: 200 });
            response.headers.append('Access-Control-Allow-Credentials', 'true');
            response.cookies.set('accessToken', access, { httpOnly: true, path: '/', sameSite: 'lax', secure: true });
            response.cookies.set('refreshToken', refresh, { httpOnly: true, path: '/', sameSite: 'lax', secure: true });
            return response;
        };
        return NextResponse.json({ error: res.data }, { status: res.status });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Error en el servidor, favor intentelo más tarde" }, { status: 500 });
    }
};

export { POST };
