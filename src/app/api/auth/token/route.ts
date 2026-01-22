
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
            const { access, refresh, access_token, refresh_token } = res.data;

            // Return full data to frontend as requested by user / API reference
            const response = NextResponse.json(res.data, { status: 200 });

            response.headers.append('Access-Control-Allow-Credentials', 'true');

            // Support both naming conventions from docs/reference for the cookies
            const finalAccess = access || access_token;
            const finalRefresh = refresh || refresh_token;

            if (finalAccess) {
                response.cookies.set('accessToken', finalAccess, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'lax',
                    secure: true
                });
            }
            if (finalRefresh) {
                response.cookies.set('refreshToken', finalRefresh, {
                    httpOnly: true,
                    path: '/',
                    sameSite: 'lax',
                    secure: true
                });
            }

            return response;
        }

        return NextResponse.json({ error: res.data }, { status: res.status });
    } catch (e: unknown) {
        console.error("BFF Login Error:", e);
        return NextResponse.json(
            { error: "Error en el servidor, favor intentelo más tarde" },
            { status: 500 }
        );
    }
};

export { POST };
