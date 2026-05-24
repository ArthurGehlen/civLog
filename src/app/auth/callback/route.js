import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const type = searchParams.get("type");
  const code = searchParams.get("code");

  if (type === "recovery" && code) {
    const redirectUrl = `${origin}/update-password?code=${code}`;
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect(`${origin}/forgot-password`);
}
