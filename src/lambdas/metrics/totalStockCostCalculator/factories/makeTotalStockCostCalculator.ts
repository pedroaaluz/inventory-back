import {prisma} from '../../../../../prisma/prismaClient';
import {TotalStockCostCalculatorRepository} from '../../../../common/repositories/metrics/totalStockCostCalculatorRepository';
import {TotalStockCostCalculatorUseCase} from '../domain/totalStockCostCalculatorUseCase';
import {TotalStockCostCalculatorUseCaseController} from '../ports/controller/totalStockCostCalculatorUseCaseController';

export function makeTotalStockCostCalculatorController() {
  const dbClient = prisma;

  const totalStockCostCalculatorRepository =
    new TotalStockCostCalculatorRepository(dbClient);

  const totalStockCostCalculatorUseCase = new TotalStockCostCalculatorUseCase(
    totalStockCostCalculatorRepository,
  );
  const totalStockCostCalculatorController =
    new TotalStockCostCalculatorUseCaseController(
      totalStockCostCalculatorUseCase,
    );

  return totalStockCostCalculatorController;
}
