// import { IsString } from "class-validator";

export interface File {
  // @IsString()
  fileName: string;
  // @IsString()
  userName: string;
  // @IsString()
  text: string;
  title: string[]; // may contain aliase
  tags: string[]; // may contain multiple tags
}
