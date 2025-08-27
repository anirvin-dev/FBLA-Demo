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

  /** Cleans up the cache on module destroy. */
  onModuleDestroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.logger.log('Cache cleanup interval stopped');
    }
    this.codeCache.clear();
  }

  /** Cleans up expired cache entries. */
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

  /** Gets the window ID for the current time. */
  private getWindowId() {
    const windowStart = Math.floor(Date.now() / this.NEW_CODE_INTERVAL);
    return windowStart;
  }

  /** Generates a 4-digit code for the current window. */
  private generateCode() {
    return 1000 + (randomBytes(2).readUInt16BE(0) % 9000);
  }

  /** Checks if a code exists in the cache for the current window. If not, generates a new code and caches it. */
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

  /** Verifies a code against the cache for the current window. */
  public verifyCode(code: number) {
    const windowId = this.getWindowId();
    const cachedCode = this.codeCache.get(windowId);
    if (cachedCode) {
      return cachedCode.code === code && cachedCode.expiresAt > Date.now();
    }
    return false;
  }
}
