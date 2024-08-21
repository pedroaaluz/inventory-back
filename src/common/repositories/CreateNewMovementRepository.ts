import type {PrismaClient, Movement} from '@prisma/client';
import {Repository} from '../interfaces';

export class CreateNewMovementRepository
  implements Repository<Movement, Movement>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(movementDTO: Movement) {
    const movement = await this.dbClient.movement.create({data: movementDTO});

    return movement;
  }
}
