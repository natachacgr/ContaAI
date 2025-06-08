import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from "class-validator";

// Enum que corresponde ao frontend
export enum TransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

// Alias para compatibilidade com DTO
export const EntryType = TransactionType;

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number; // Usando definite assignment assertion

  @Column({ type: "date" })
  @IsDateString()
  date!: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  description!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  @IsPositive()
  value!: number;

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  @IsEnum(TransactionType)
  type!: TransactionType;
}
