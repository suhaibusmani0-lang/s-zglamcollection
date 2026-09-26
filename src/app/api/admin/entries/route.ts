import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db';
import { apiSuccess, apiError } from '@/lib/api-response';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('q') || '').toLowerCase().trim();
    const statusFilter = searchParams.get('status');

    let entries = await dbService.getEntries();

    if (statusFilter && statusFilter !== 'ALL') {
      entries = entries.filter(e => e.status === statusFilter);
    }

    if (search) {
      entries = entries.filter(
        e =>
          e.fullName.toLowerCase().includes(search) ||
          e.tiktokHandle.toLowerCase().includes(search) ||
          e.ticketNumber.toLowerCase().includes(search) ||
          e.phone.includes(search)
      );
    }

    return NextResponse.json({
      success: true,
      entries,
      totalCount: entries.length,
      metrics: {
        totalRevenue: entries
          .filter(e => e.status === 'APPROVED')
          .reduce((sum, e) => sum + (e.amountPaid || 0), 0),
        approvedCount: entries.filter(e => e.status === 'APPROVED').length,
        rejectedCount: entries.filter(e => e.status === 'REJECTED').length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to retrieve entries', 'ENTRIES_ADMIN_ERROR', 500);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !['APPROVED', 'REJECTED'].includes(status)) {
      return apiError('Missing or invalid entry id or status', 'INVALID_UPDATE_PARAMETERS', 400);
    }

    const updated = await dbService.updateEntryStatus(id, status);
    if (!updated) {
      return apiError(`Entry with ID ${id} not found.`, 'ENTRY_NOT_FOUND', 404);
    }

    return NextResponse.json({
      success: true,
      entry: updated,
      message: `Entry status updated to ${status}.`
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to update entry', 'ENTRY_STATUS_ERROR', 500);
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return apiError('Missing entry id parameter', 'MISSING_ID', 400);
    }

    const deleted = await dbService.deleteEntry(id);
    if (!deleted) {
      return apiError(`Entry with ID ${id} not found or already deleted.`, 'ENTRY_NOT_FOUND', 404);
    }

    return NextResponse.json({
      success: true,
      deletedId: id,
      message: 'Entry permanently deleted.'
    });
  } catch (error: any) {
    return apiError(error.message || 'Failed to delete entry', 'ENTRY_DELETE_ERROR', 500);
  }
}
