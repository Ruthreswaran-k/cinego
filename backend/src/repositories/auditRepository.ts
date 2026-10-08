export class AuditRepository {
  async logAction(action: string, entityId: string, details: string): Promise<void> {
    throw new Error('Not implemented yet');
  }
  async getAuditLogs(): Promise<any[]> {
    throw new Error('Not implemented yet');
  }
}
export const auditRepository = new AuditRepository();
