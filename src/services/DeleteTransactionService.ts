import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    try {
      await transactionsRepository.delete(id);
    } catch {
      throw new AppError('Must insert a valid transaction');
    }
  }
}

export default DeleteTransactionService;
