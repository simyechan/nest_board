import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { createReqBoardDto } from './createBoard.dto';

export class createMultipleBoardsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => createReqBoardDto)
  boards: createReqBoardDto[];
}
