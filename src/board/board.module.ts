import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { Boards } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardsController } from './board.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Boards]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  providers: [BoardService, BoardRepository],
  controllers: [BoardsController],
  exports: [BoardService],
})
export class BoardModule {}
