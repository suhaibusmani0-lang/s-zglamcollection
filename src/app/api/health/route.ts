import { dbService } from '@/lib/db';
import { apiSuccess } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

const startTime = Date.now();

export async function GET() {
  const healthData = await dbService.getHealthStatus();

  return apiSuccess({
    status: 'UP',
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    health: healthData,
    system: {
      nodeVersion: process.version,
      memoryUsageMB: {
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
    },
  });
}
