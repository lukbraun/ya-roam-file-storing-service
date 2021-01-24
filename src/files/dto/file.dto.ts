// import { IsString } from "class-validator";

export interface File {
  fileName: string;
  userName: string;
  text: string;
  title: string[]; // may contain aliase
  tags: string[]; // may contain multiple tags
  references: string[];
}
