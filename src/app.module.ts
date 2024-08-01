import { Module } from '@nestjs/common';
import { BoardModule } from './board/board.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentModule } from './comment/comment.module';
import { ReplyModule } from './reply/reply.module';
import { UserModule } from './user/user.module';
import { User } from './user/board.user-entity';
import { Boards } from './board/board.entity';
import { Comment } from './comment/comment.entity';
import { Reply } from './reply/reply.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('HOST'),
        post: configService.get<number>('PORT'),
        password: configService.get<string>('USERNAME'),
        database: configService.get<string>('DATABASE'),
        entities: [User, Comment, Boards, Reply],
        // entities: [__dirname + '/../**/*.entity.{js,ts}'],
        synchronize: true,
        logging: true,
      }),
    }),
    BoardModule,
    CommentModule,
    ReplyModule,
    UserModule,
  ],
})
export class AppModule {}
