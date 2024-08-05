import {
  Injectable,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Boards } from './board.entity';

@Injectable()
export class BoardRepository extends Repository<Boards> {
  constructor(private dataSource: DataSource) {
    super(Boards, dataSource.createEntityManager());
  }
}
