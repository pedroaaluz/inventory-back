import type {PrismaClient, Movement} from '@prisma/client';
import {Repository} from '../../interfaces';
import {TCreateMovementInput} from '../../types/movement';

export class CreateMovementsRepository
  implements Repository<TCreateMovementInput, Movement[]>
{
  constructor(private readonly dbClient: PrismaClient) {}

  async exec(movementDTO: TCreateMovementInput | TCreateMovementInput[]) {
    const movements = await this.dbClient.$transaction(async tx => {
      return await tx.movement.createManyAndReturn({
        data: Array.isArray(movementDTO) ? movementDTO : [movementDTO],
      });
    });

    console.log('Movements created: ', movements);

    return movements;
  }
}
