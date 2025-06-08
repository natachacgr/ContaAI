import {
  IsNotEmpty,
  IsPositive,
  IsEnum,
  IsDateString,
  MaxLength,
  IsOptional,
} from "class-validator";
import { TransactionType } from "../entities/Transaction";

// Alias para compatibilidade
export const EntryType = TransactionType;

export class CreateAccountingEntryDto {
  @IsNotEmpty({ message: "Date is required" })
  @IsDateString(
    {},
    { message: "Date must be a valid date (YYYY-MM-DD format)" }
  )
  date!: string; // Definite assignment assertion

  @IsNotEmpty({ message: "Description is required" })
  @MaxLength(255, { message: "Description must not exceed 255 characters" })
  description!: string;

  @IsPositive({ message: "Value must be a positive number" })
  value!: number;

  @IsEnum(TransactionType, {
    message: "Type must be either 'credit' or 'debit'",
  })
  type!: TransactionType;
}

export class UpdateAccountingEntryDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: "Date must be a valid date (YYYY-MM-DD format)" }
  )
  date?: string; // Opcional para updates

  @IsOptional()
  @MaxLength(255, { message: "Description must not exceed 255 characters" })
  description?: string; // Opcional para updates

  @IsOptional()
  @IsPositive({ message: "Value must be a positive number" })
  value?: number; // Opcional para updates

  @IsOptional()
  @IsEnum(TransactionType, {
    message: "Type must be either 'credit' or 'debit'",
  })
  type?: TransactionType; // Opcional para updates
}

export interface MonthlyTotals {
  month: string;
  year: number;
  totalCredits: number;
  totalDebits: number;
  balance: number;
}

export interface AccountingEntryResponse {
  id: number;
  date: string;
  description: string;
  value: number;
  type: TransactionType;
}
