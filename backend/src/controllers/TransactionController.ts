import { Request, Response } from "express";
import { Transaction, TransactionType } from "../entities/Transaction";
import { TransactionService } from "../services/TransactionService";
import { TransactionValidator } from "../validators/TransactionValidator";

export class TransactionController {
  private service = new TransactionService();

  create = async (req: Request, res: Response) => {
    // 1. Chame o validador completo para criação
    const validation = await TransactionValidator.validateForCreate(req.body);

    // 2. Se houver erros, retorne-os imediatamente
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // 3. Se a validação passou, os dados em req.body já foram implicitamente validados
    // e podem ser usados para criar a entidade.
    const { date, description, value, type } = req.body;

    const transaction = new Transaction();
    transaction.date = date;
    transaction.description = description.trim(); // Ainda é bom trimar para garantir
    transaction.value = Number(value); // Garantir que é um número
    transaction.type = type as TransactionType; // Fazer o cast para o enum

    try {
      const saved = await this.service.create(transaction);
      return res.status(201).json(saved);
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      return res.status(500).json({ error: "Falha ao salvar transação." });
    }
  };

  getAll = async (_: Request, res: Response) => {
    try {
      const result = await this.service.getAll();
      return res.status(200).json(result);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return res.status(500).json({ error: "Falha ao buscar transações." });
    }
  };

  getById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID válido é obrigatório" });
    }

    try {
      const transaction = await this.service.getById(Number(id));
      if (!transaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }
      return res.status(200).json(transaction);
    } catch (error) {
      console.error("Erro ao buscar transação:", error);
      return res.status(500).json({ error: "Falha ao buscar transação." });
    }
  };

  update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body; // Passa o body completo para o validador

    // 1. Chame o validador completo para atualização
    // Ele cuidará da validação do ID e dos dados da transação
    const validation = await TransactionValidator.validateForUpdate(
      Number(id),
      updateData
    );

    // 2. Se houver erros, retorne-os imediatamente
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    try {
      // 3. Verifique se a transação existe antes de tentar atualizar
      const existingTransaction = await this.service.getById(Number(id));
      if (!existingTransaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

      // 4. Se a validação passou e a transação existe, proceda com a atualização.
      // O validador já garantiu que os dados estão no formato correto.
      const updated = await this.service.update(Number(id), updateData);
      return res.status(200).json(updated);
    } catch (error) {
      console.error("Erro ao atualizar transação:", error);
      return res.status(500).json({ error: "Falha ao atualizar transação." });
    }
  };

  delete = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "ID válido é obrigatório" });
    }

    try {
      const transaction = await this.service.getById(Number(id));
      if (!transaction) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }

      await this.service.delete(Number(id));
      return res.status(204).send(); // No content
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      return res.status(500).json({ error: "Falha ao deletar transação." });
    }
  };
}
