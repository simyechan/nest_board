import { findReplyDto } from "src/reply/dto/res/findReply.dto";

export class findCommentDto {
  id: number;
  content: string;
  name: string;
  reply: findReplyDto[];
}