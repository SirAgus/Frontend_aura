
import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/services/api";

const POST = async (request: NextRequest) => {
    try {
        const contentType = request.headers.get("content-type") || "";
        let body;

        if (contentType.includes("application/x-www-form-urlencoded")) {
            body = await request.formData();
        } else {
            body = await request.json();
        }

        const res = await api.post('/auth/token', body, {
            headers: { 'Content-Type': contentType }
        });

        if (res.status === 200 || res.status === 201) {
            const { access, refresh, access_token, refresh_token, user_id } = res.data;

            const response = NextResponse.json({
                message: "Success",
                user_id: user_id
            }, { status: 200 });

            response.headers.append('Access-Control-Allow-Credentials', 'true');

            // Support both naming conventions from docs/reference
            const finalAccess = access || access_token;
            const finalRefresh = refresh || refresh_token;

            response.cookies.set('accessToken', finalAccess, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                secure: true
            });
            response.cookies.set('refreshToken', finalRefresh, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
                secure: true
            });

            return response;
        }

        return NextResponse.json({ error: res.data }, { status: res.status });
    } catch (e: any) {
        console.error("BFF Login Error:", e);
        return NextResponse.json(
            { error: "Error en el servidor, favor intentelo más tarde" },
            { status: 500 }
        );
    }
};

export { POST };
