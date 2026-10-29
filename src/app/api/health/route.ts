import { apiSuccess } from "@/lib/api/response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Quick DB ping
    await prisma.$queryRaw`SELECT 1`;
    return apiSuccess({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "EcoPulse Platform API",
      uptime: process.uptime(),
    });
  } catch (error) {
    return apiSuccess(
      {
        status: "degraded",
        timestamp: new Date().toISOString(),
        service: "EcoPulse Platform API",
        note: "Database connection ping failed or unavailable",
      },
      503
    );
  }
}
