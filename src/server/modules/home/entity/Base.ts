import { PrimaryGeneratedColumn, Column } from "typeorm";

export abstract class Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: true
  })
  status: boolean;

  @Column({
    default: false
  })
  deleted: boolean;

  @Column()
  date_added: number;

  @Column()
  date_modified: number;
}
