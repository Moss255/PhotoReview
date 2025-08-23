import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}

  findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }

  findOne(id: string): Promise<Photo> {
    return this.photoRepository.findOneByOrFail({ id });
  }

  async create(photo: Photo): Promise<Photo> {
    return this.photoRepository.save(photo);
  }

  async updateCursedStatus(photoId: string, status: string) {
    const photo = await this.findOne(photoId);
    photo.result = status;
    await this.create(photo);
  }
}
