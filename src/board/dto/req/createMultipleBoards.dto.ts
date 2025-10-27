import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { createReqBoardDto } from './createBoard.dto';

export class createMultipleBoardsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => createReqBoardDto)
  boards: createReqBoardDto[];
}
