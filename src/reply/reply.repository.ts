import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Reply } from './reply.entity';

@Injectable()
export class ReplyRepository extends Repository<Reply> {
  constructor(private dataSource: DataSource) {
    super(Reply, dataSource.createEntityManager());
  }
}
