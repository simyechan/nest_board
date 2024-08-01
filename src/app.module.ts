import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { CommentModule } from './comment/comment.module';
import { ReplyModule } from './reply/reply.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    BoardModule,
    CommentModule,
    ReplyModule,
    UserModule]
})
export class AppModule {}
