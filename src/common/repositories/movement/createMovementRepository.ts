import type {PrismaClient, Movement} from '@prisma/client';
import {Repository} from '../../interfaces';
import {TCreateMovementInput} from '../../types/movement';

export class CreateMovementRepository
  implements Repository<TCreateMovementInput, Movement>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(movementDTO: TCreateMovementInput) {
    const movement = await this.dbClient.$transaction(async tx => {
      return tx.movement.create({data: movementDTO});
    });

    return movement;
  }
}
