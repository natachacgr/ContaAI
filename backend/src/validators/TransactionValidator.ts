import { validate, ValidationError } from "class-validator";
import { Transaction, TransactionType } from "../entities/Transaction";

export interface ValidationResult {
  valid: boolean;
  errors?: FormattedValidationError[];
}

export interface FormattedValidationError {
  field: string;
  value: any;
  messages: string[];
}

export class TransactionValidator {
  /**
   * Valida uma transação usando class-validator
   */
  static async validateTransaction(
    data: Partial<Transaction>
  ): Promise<ValidationResult> {
    // Criar instância da Transaction com os dados fornecidos
    const transaction = Object.assign(new Transaction(), data);

    try {
      const errors = await validate(transaction, {
        skipMissingProperties: false,
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const formattedErrors = this.formatValidationErrors(errors);
        return {
          valid: false,
          errors: formattedErrors,
        };
      }

      return { valid: true };
    } catch (error) {
      console.error("Error during validation:", error);
      return {
        valid: false,
        errors: [
          {
            field: "general",
            value: null,
            messages: ["Validation error occurred"],
          },
        ],
      };
    }
  }

  /**
   * Validação básica antes da validação com class-validator
   */
  static validateBasicFields(data: any): ValidationResult {
    const errors: FormattedValidationError[] = [];

    // Validar se todos os campos obrigatórios estão presentes
    if (!data.date) {
      errors.push({
        field: "date",
        value: data.date,
        messages: ["Date is required"],
      });
    }

    if (
      !data.description ||
      typeof data.description !== "string" ||
      !data.description.trim()
    ) {
      errors.push({
        field: "description",
        value: data.description,
        messages: ["Description is required and must be a non-empty string"],
      });
    }

    if (data.value === undefined || data.value === null) {
      errors.push({
        field: "value",
        value: data.value,
        messages: ["Value is required"],
      });
    } else if (isNaN(Number(data.value)) || Number(data.value) <= 0) {
      errors.push({
        field: "value",
        value: data.value,
        messages: ["Value must be a positive number"],
      });
    }

    if (!data.type) {
      errors.push({
        field: "type",
        value: data.type,
        messages: ["Type is required"],
      });
    } else if (!Object.values(TransactionType).includes(data.type)) {
      errors.push({
        field: "type",
        value: data.type,
        messages: [
          `Type must be either '${TransactionType.CREDIT}' or '${TransactionType.DEBIT}'`,
        ],
      });
    }

    // Validar formato da data se fornecida
    if (data.date && !this.isValidDateFormat(data.date)) {
      errors.push({
        field: "date",
        value: data.date,
        messages: ["Date must be in YYYY-MM-DD format"],
      });
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Validação completa (básica + class-validator)
   */
  static async validateTransactionComplete(
    data: any
  ): Promise<ValidationResult> {
    // Primeiro, validação básica
    const basicValidation = this.validateBasicFields(data);
    if (!basicValidation.valid) {
      return basicValidation;
    }

    // Sanitizar dados antes da validação com class-validator
    const sanitizedData = this.sanitizeTransactionData(data);

    // Validação com class-validator
    return await this.validateTransaction(sanitizedData);
  }

  /**
   * Sanitiza os dados da transação
   */
  static sanitizeTransactionData(data: any): Partial<Transaction> {
    return {
      date: data.date?.toString().trim(),
      description: data.description?.toString().trim(),
      value: Number(data.value),
      type: data.type as TransactionType,
    };
  }

  /**
   * Formata erros de validação do class-validator
   */
  private static formatValidationErrors(
    errors: ValidationError[]
  ): FormattedValidationError[] {
    return errors.map((error) => ({
      field: error.property,
      value: error.value,
      messages: error.constraints
        ? Object.values(error.constraints)
        : ["Invalid value"],
    }));
  }

  /**
   * Verifica se a data está no formato correto (YYYY-MM-DD)
   */
  private static isValidDateFormat(dateString: string): boolean {
    // Regex para formato YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(dateString)) {
      return false;
    }

    // Verificar se é uma data válida
    const date = new Date(dateString);
    const parts = dateString.split("-");

    return (
      date.getFullYear() === parseInt(parts[0]) &&
      date.getMonth() === parseInt(parts[1]) - 1 &&
      date.getDate() === parseInt(parts[2])
    );
  }

  /**
   * Valida se uma transação pode ser atualizada
   */
  static async validateForUpdate(
    id: number,
    data: any
  ): Promise<ValidationResult> {
    // Validar ID
    if (!id || isNaN(id) || id <= 0) {
      return {
        valid: false,
        errors: [
          {
            field: "id",
            value: id,
            messages: ["Valid ID is required for update"],
          },
        ],
      };
    }

    // Validar dados da transação
    return await this.validateTransactionComplete(data);
  }

  /**
   * Valida dados para criação de transação
   */
  static async validateForCreate(data: any): Promise<ValidationResult> {
    return await this.validateTransactionComplete(data);
  }
}
