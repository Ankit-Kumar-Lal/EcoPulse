import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status }
  );
}

export function apiError(
  message: string,
  code: string = "INTERNAL_ERROR",
  status: number = 500,
  details?: any
) {
  return NextResponse.json<ApiResponse>(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}
