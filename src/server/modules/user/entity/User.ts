import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Base } from "../../home/entity/Base";
import { USER_TABLE } from "../constants/tables";

@Entity({ name: USER_TABLE })
export class User extends Base {
  @Column()
  username: string;

  @Column({
    nullable: true
  })
  first_name: string;

  @Column({
    nullable: true
  })
  last_name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  role: string;

  @Column({
    nullable: true
  })
  facebook_id: string;

  @Column({
    default: false
  })
  verified: boolean;

  @Column({
    default: false
  })
  forgotten_password: boolean;
}
