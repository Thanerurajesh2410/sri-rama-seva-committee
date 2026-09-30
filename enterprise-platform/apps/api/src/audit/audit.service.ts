import { Injectable, Logger } from '@nestjs/common';
import { IAuditLog } from '@temple/types';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  private auditLogs: IAuditLog[] = [];

  async logAction(params: {
    userId?: string;
    userRole?: string;
    action: string;
    entityName: string;
    entityId?: string;
    oldValue?: string;
    newValue?: string;
    ipAddress?: string;
  }): Promise<IAuditLog> {
    const logEntry: IAuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: params.userId || 'SYSTEM',
      userRole: params.userRole || 'SYSTEM_AUTOMATED',
      action: params.action,
      entityName: params.entityName,
      entityId: params.entityId,
      oldValue: params.oldValue,
      newValue: params.newValue,
      ipAddress: params.ipAddress || '127.0.0.1',
      timestamp: new Date()
    };

    this.auditLogs.unshift(logEntry);
    this.logger.log(`[AUDIT LOG] ${logEntry.action} on ${logEntry.entityName} by ${logEntry.userRole}`);
    return logEntry;
  }

  async getLogs(limit = 100): Promise<IAuditLog[]> {
    return this.auditLogs.slice(0, limit);
  }
}
