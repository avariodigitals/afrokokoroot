import { NextResponse } from "next/server"
import { AuthError, loginAdminUser, setAdminSessionCookie } from "@/lib/admin-auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body
    const result = await loginAdminUser(username, password)
    await setAdminSessionCookie(result.token)

    return NextResponse.json(
      { success: true, message: "Login successful", user: result.user },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status }
      )
    }

    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    )
  }
}
