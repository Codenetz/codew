import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../user/entity/User";
import { Base } from "../../../core/entity/Base";
import { IMAGE_TABLE } from "../constants/tables";

@Entity({ name: IMAGE_TABLE })
export class Image extends Base {
  @Column()
  path: string;

  @Column()
  extension: string;

  @Column({ nullable: true })
  alt: string;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  filesize: number;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user_id: User;
}
