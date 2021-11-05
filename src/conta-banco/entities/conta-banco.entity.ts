import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Banco } from '../../banco/entities/banco.entity';
import { Titular } from '../../titular/entities/titular.entity';

@Entity()
export class ContaBanco extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'conta', type: 'int' })
  conta: number;

  @Column({ name: 'digito', type: 'int' })
  digito: number;

  @Column({ name: 'saldo', type: 'int' })
  saldo: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Banco, (banco) => banco.contaBanco, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  banco: Banco;

  @OneToOne(() => Titular, (titular) => titular.contaBanco, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  titular: Titular;
}
