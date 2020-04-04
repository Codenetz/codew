import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../user/entity/User";
import { Base } from "../../home/entity/Base";
import { VIDEO_TABLE } from "../constants/tables";

@Entity({ name: VIDEO_TABLE })
export class Video extends Base {
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
  duration: number;

  @Column()
  format: string;

  @Column()
  frame_rate: string;

  @Column()
  file_size: number;

  @ManyToOne(type => User, { nullable: true })
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user_id: User;
}
