import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { randomBytes } from 'node:crypto';

type CodeCacheEntry = {
  code: number;
  expiresAt: number;
};

@Injectable()
export class AttendanceTwoFAService implements OnModuleDestroy {
  private codeCache = new Map<number, CodeCacheEntry>();
  private cleanupInterval?: NodeJS.Timeout;

  private readonly logger = new Logger(AttendanceTwoFAService.name);

  private readonly NEW_CODE_INTERVAL = 30_000;
  private readonly CODE_TTL = 60_000;

  constructor() {
    this.cleanupInterval = setInterval(
      () => this.cleanupExpiredCache(),
      this.CODE_TTL,
    );
  }

  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.logger.log('Cache cleanup interval stopped');
    }
    this.codeCache.clear();
  }

  private cleanupExpiredCache() {
    const currentWindowId = this.getWindowId();
    let cleanedCount = 0;

    for (const [windowId] of this.codeCache.entries()) {
      if (currentWindowId - windowId > 2) {
        this.codeCache.delete(windowId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned ${cleanedCount} expired cache entries`);
    }
  }

  private getWindowId() {
    const windowStart = Math.floor(Date.now() / this.NEW_CODE_INTERVAL);
    return windowStart;
  }

  private generateCode() {
    return 100000 + (randomBytes(3).readUInt16BE(0) % 900000);
  }

  public getOrCreateCode() {
    const windowId = this.getWindowId();
    const cachedCode = this.codeCache.get(windowId);
    if (cachedCode) {
      return cachedCode.code;
    }

    const newCode = this.generateCode();
    this.codeCache.set(windowId, {
      code: newCode,
      expiresAt: Date.now() + this.CODE_TTL,
    });
    return newCode;
  }

  public verifyCode(code: number) {
    const windowId = this.getWindowId();
    const cachedCode = this.codeCache.get(windowId);
    if (cachedCode) {
      return cachedCode.code === code && cachedCode.expiresAt > Date.now();
    }
    return false;
  }
}
