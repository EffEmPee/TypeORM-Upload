import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (total < value && type === 'outcome') {
      throw new AppError('You don`t have enough balance!');
    }

    let verifyCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!verifyCategory) {
      verifyCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(verifyCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      type,
      value,
      category: verifyCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
