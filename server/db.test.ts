import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateRefId } from './db';

// Mock drizzle-orm
const mockDb = {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
};

describe('generateRefId', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should generate a RefID in the correct format', async () => {
        // Mock empty result (no collision)
        mockDb.limit.mockResolvedValue([]);

        const refId = await generateRefId(mockDb as any);

        expect(refId).toMatch(/^REF-\d{8}-[A-Z0-9]{4}$/);
    });

    it('should handle collisions by retrying', async () => {
        // Mock collision on first attempt, success on second
        mockDb.limit
            .mockResolvedValueOnce([{ id: 1 }]) // First attempt collision
            .mockResolvedValueOnce([]); // Second attempt success

        const refId = await generateRefId(mockDb as any);

        expect(refId).toMatch(/^REF-\d{8}-[A-Z0-9]{4}$/);
        expect(mockDb.limit).toHaveBeenCalledTimes(2);
    });
});
