import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { ContaBanco } from '../../conta-banco/entities/conta-banco.entity';

@Entity()
export class Banco extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'codigo', type: 'varchar', length: 50 })
  codigo: string;

  @Column({ name: 'agencia', type: 'varchar', length: 50 })
  agencia: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => ContaBanco, (contaBanco) => contaBanco.banco)
  contaBanco: ContaBanco[];
}
