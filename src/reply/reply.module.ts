import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './reply.entity';
import { ReplyRepository } from './reply.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Reply])],
  controllers: [ReplyController],
  providers: [ReplyService, ReplyRepository],
})
export class ReplyModule {}
