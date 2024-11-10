import type {PrismaClient, Movement} from '@prisma/client';
import {Repository} from '../../interfaces';
export class GetMovementRepository
  implements Repository<string, Movement | null>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(movementId: string) {
    return await this.dbClient.movement.findUnique({
      where: {
        id: movementId,
      },
    });
  }
}
