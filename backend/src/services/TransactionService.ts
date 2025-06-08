import { AppDataSource } from "../database/dataSource";
import { Transaction, TransactionType } from "../entities/Transaction";

export class TransactionService {
  private repository = AppDataSource.getRepository(Transaction);

  async create(data: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.repository.create(data);
    return await this.repository.save(transaction);
  }

  async getAll(): Promise<Transaction[]> {
    // Retorna todas as transações ordenadas por data (mais recente primeiro)
    return await this.repository.find({
      order: {
        date: "DESC",
        id: "DESC",
      },
    });
  }

  async getById(id: number): Promise<Transaction | null> {
    return await this.repository.findOne({
      where: { id },
    });
  }

  async update(
    id: number,
    data: Partial<Transaction>
  ): Promise<Transaction | null> {
    await this.repository.update(id, data);
    return await this.getById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  // Método para obter transações agrupadas por mês (se necessário)
  async getGroupedByMonth(): Promise<any> {
    const transactions = await this.getAll();
    return this.groupByMonth(transactions);
  }

  // Método para filtrar transações por período
  async getByDateRange(
    startDate?: string,
    endDate?: string
  ): Promise<Transaction[]> {
    const queryBuilder = this.repository.createQueryBuilder("transaction");

    if (startDate) {
      queryBuilder.andWhere("transaction.date >= :startDate", { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere("transaction.date <= :endDate", { endDate });
    }

    return await queryBuilder
      .orderBy("transaction.date", "DESC")
      .addOrderBy("transaction.id", "DESC")
      .getMany();
  }

  // Método para obter totais por mês
  async getMonthlyTotals(year?: number): Promise<any[]> {
    const queryBuilder = this.repository.createQueryBuilder("transaction");

    if (year) {
      queryBuilder.where("EXTRACT(YEAR FROM transaction.date) = :year", {
        year,
      });
    }

    const transactions = await queryBuilder
      .orderBy("transaction.date", "ASC")
      .getMany();

    const monthlyData: {
      [key: string]: {
        credit: number;
        debit: number;
        transactions: Transaction[];
      };
    } = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { credit: 0, debit: 0, transactions: [] };
      }

      monthlyData[monthKey].transactions.push(transaction);

      if (transaction.type === TransactionType.CREDIT) {
        monthlyData[monthKey].credit += Number(transaction.value);
      } else {
        monthlyData[monthKey].debit += Number(transaction.value);
      }
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data,
      balance: data.credit - data.debit,
    }));
  }

  private groupByMonth(transactions: Transaction[]) {
    const grouped: {
      [key: string]: {
        transactions: Transaction[];
        totalCredit: number;
        totalDebit: number;
        balance: number;
      };
    } = {};

    for (const t of transactions) {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;

      if (!grouped[key]) {
        grouped[key] = {
          transactions: [],
          totalCredit: 0,
          totalDebit: 0,
          balance: 0,
        };
      }

      grouped[key].transactions.push(t);
      if (t.type === TransactionType.CREDIT) {
        grouped[key].totalCredit += Number(t.value);
      } else {
        grouped[key].totalDebit += Number(t.value);
      }

      grouped[key].balance = grouped[key].totalCredit - grouped[key].totalDebit;
    }

    return grouped;
  }
}
