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
import { AuthModule } from './auth/auth.module';

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
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, Comment, Boards, Reply],
        synchronize: true,
        logging: true,
      }),
    }),
    BoardModule,
    CommentModule,
    ReplyModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
