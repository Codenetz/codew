import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "../../home/entity/Base";
import { META_TAG_TABLE } from "../constants/tables";
import { Meta } from "./Meta";

@Entity({ name: META_TAG_TABLE })
export class MetaTag extends Base {
  @Column()
  tag: string;

  @ManyToOne(type => Meta, { nullable: true })
  @JoinColumn({ name: "meta_id", referencedColumnName: "id" })
  meta_id: Meta;
}
