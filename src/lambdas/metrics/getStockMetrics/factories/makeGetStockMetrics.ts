import {prisma} from '../../../../../prisma/prismaClient';
import {GetStockMetricsRepository} from '../../../../common/repositories/metrics/getStockMetricsRepository';
import {GetStockMetricsUseCase} from '../domain/getStockMetricsUseCase';
import {GetStockMetricsController} from '../ports/controller/getStockMetricsController';

export function makeGetStockMetrics() {
  const dbClient = prisma;

  const getStockMetricsRepository = new GetStockMetricsRepository(dbClient);

  const getStockMetricsUseCase = new GetStockMetricsUseCase(
    getStockMetricsRepository,
  );

  const getStockMetricsController = new GetStockMetricsController(
    getStockMetricsUseCase,
  );

  return getStockMetricsController;
}
