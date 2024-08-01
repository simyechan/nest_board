import { Injectable, NotFoundException } from '@nestjs/common';
import { Boards } from './board.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { createBoardDto } from './dto/createBoard.dto';
import { updateBoardDto } from './dto/updateBoard.dto';
import { CommentRepository } from 'src/comment/comment.repository';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
    @InjectRepository(CommentRepository)
    private commentRepository: CommentRepository,
  ) {}

  async findAll(): Promise<{ board: Boards; commentCount: number }[]> {
    try {
      const boards = this.boardRepository.find({
        relations: ['user', 'comments'],
      });

      if (!boards) {
        throw new NotFoundException('게시물을 찾을 수 없습니다');
      }

      const boardIds = (await boards).map((board) => board.id);

      const commentCounts = await this.commentRepository
        .createQueryBuilder('comment')
        .select('comment.boardId', 'boardId')
        .addSelect('COUNT(comment.id)', 'count')
        .where('comment.boardId IN (:...boardIds)', { boardIds })
        .groupBy('comment.boardId')
        .getRawMany();

      const commentCountMap = new Map(
        commentCounts.map((item) => [item.boardId, parseInt(item.count, 10)]),
      );

      const results = (await boards).map((board) => {
        const commentCount = commentCountMap.get(board.id) || 0;
        return { board, commentCount };
      });

      return results;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('게시물 조회 중 오류 발생', error);
    }
  }

  async create(
    createBoardDto: createBoardDto,
    file: Express.Multer.File,
  ): Promise<Boards> {
    try {
      return this.boardRepository.createB(createBoardDto, file);
    } catch (error) {
      console.error('게시물 생성 중 오류 발생', error);
    }
  }

  async find(
    boardId: number,
  ): Promise<{ board: Boards; commentCount: number }> {
    try {
      const board = await this.boardRepository.findOne({
        where: { id: boardId },
        relations: ['user', 'comments'],
      });

      if (!board) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }

      const commentResult = await this.commentRepository
        .createQueryBuilder('comment')
        .select('COUNT(comment.id)', 'count')
        .where('comment.boardId = :boardId', { boardId })
        .getRawOne();

      const commentCount = parseInt(commentResult.count, 10);

      return { board, commentCount };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('게시물 조회 중 오류 발생', error);
    }
  }

  async delete(boardId: number): Promise<void> {
    try {
      const result = await this.boardRepository.delete(boardId);

      if (result.affected === 0) {
        throw new NotFoundException('게시물을 찾을 수 없습니다.');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('게시물 삭제 중 오류 발생', error);
    }
  }

  async update(
    boardId: number,
    updateBoardDto: updateBoardDto,
    file: Express.Multer.File | undefined,
  ): Promise<Boards> {
    try {
      return this.boardRepository.updateB(boardId, updateBoardDto, file);
    } catch (error) {
      console.error('게시물 업데이트 중 오류 발생', error);
    }
  }
}
