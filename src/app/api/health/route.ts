import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const health = await dbService.getHealthStatus();
    const memory = process.memoryUsage();

    return apiSuccess({
      status: 'UP',
      uptimeSeconds: Math.floor(process.uptime()),
      health,
      system: {
        nodeVersion: process.version,
        memoryUsageMB: {
          rss: Math.round(memory.rss / (1024 * 1024)),
          heapUsed: Math.round(memory.heapUsed / (1024 * 1024)),
          heapTotal: Math.round(memory.heapTotal / (1024 * 1024))
        }
      }
    });
  } catch (error: any) {
    return apiError(error.message || 'Health check failed', 'HEALTH_CHECK_ERROR', 500);
  }
}
