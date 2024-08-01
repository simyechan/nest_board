import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardsController } from './board.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    CommentModule,
    TypeOrmModule.forFeature([Boards]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  providers: [BoardService, BoardRepository],
  controllers: [BoardsController],
  exports: [BoardService, BoardRepository],
})
export class BoardModule {}
