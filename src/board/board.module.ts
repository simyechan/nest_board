import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Boards } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardsController } from './board.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CommentModule } from 'src/comment/comment.module';
import { ReplyModule } from 'src/reply/reply.module';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    CommentModule,
    ReplyModule,
    TypeOrmModule.forFeature([Boards]),
    MulterModule.register({
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4() + '-' + Date.now();
          const ext = file.originalname.split('.').pop();
          cb(null, `${uniqueSuffix}.${ext}`);
        },
      }),
    }),
  ],
  providers: [BoardService, BoardRepository],
  controllers: [BoardsController],
  exports: [BoardService, BoardRepository],
})
export class BoardModule {}
