import type {Movement, PrismaClient} from '@prisma/client';
import {Repository} from '../../interfaces';

export class DeleteMovementRepository implements Repository<string, Movement> {
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(movementId: string): Promise<Movement> {
    return await this.dbClient.movement.delete({
      where: {
        id: movementId,
      },
    });
  }
}
