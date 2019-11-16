import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "../../home/entity/Base";
import { META_TABLE } from "../constants/tables";
import { Image } from "../../media/entity/Image";

@Entity({ name: META_TABLE })
export class Meta extends Base {
  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column()
  index_type: string;

  @ManyToOne(type => Image, { nullable: true })
  @JoinColumn({ name: "image_id", referencedColumnName: "id" })
  image_id: Image;
}
