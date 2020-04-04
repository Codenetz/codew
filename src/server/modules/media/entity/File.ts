import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../user/entity/User";
import { Base } from "../../home/entity/Base";
import { FILE_TABLE } from "../constants/tables";

@Entity({ name: FILE_TABLE })
export class File extends Base {
  @Column()
  path: string;

  @Column()
  extension: string;

  @Column({ nullable: true })
  alt: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  copyright: string;

  @Column({ nullable: true })
  author: string;

  @Column()
  file_size: number;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user_id: User;
}
