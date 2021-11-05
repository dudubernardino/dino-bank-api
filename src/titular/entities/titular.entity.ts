import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { ContaBanco } from '../../conta-banco/entities/conta-banco.entity';

@Entity()
export class Titular extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'nome', type: 'varchar', length: 50 })
  nome: string;

  @Column({ name: 'cpf', type: 'varchar', length: 50 })
  cpf: string;

  @Column({ name: 'dataNascimento', type: 'date' })
  dataNascimento: Date;

  @Column({ name: 'nomePai', type: 'varchar', length: 50 })
  nomePai: string;

  @Column({ name: 'nomeMae', type: 'varchar', length: 50 })
  nomeMae: string;

  @Column({ name: 'cidade', type: 'varchar', length: 50 })
  cidade: string;

  @Column({ name: 'estado', type: 'varchar', length: 50 })
  estado: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToOne(() => ContaBanco, (contaBanco) => contaBanco.titular)
  @JoinColumn()
  contaBanco: ContaBanco;
}
