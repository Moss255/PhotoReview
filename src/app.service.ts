import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { Repository } from 'typeorm';
import { EmailService } from './email/email.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    private readonly emailService: EmailService,
  ) {}

  findAll(): Promise<Photo[]> {
    return this.photoRepository.find();
  }

  findOne(id: string): Promise<Photo> {
    return this.photoRepository.findOneByOrFail({ id });
  }

  private async sendEmail(photoId: string) {
    await this.emailService.requestCursedReview(photoId);
  }

  async create(photo: Photo): Promise<Photo> {
    const createdPhoto = await this.photoRepository.save(photo);
    await this.sendEmail(createdPhoto.id);
    return createdPhoto;
  }

  async updateCursedStatus(photoId: string, status: string) {
    const photo = await this.findOne(photoId);
    photo.result = status;
    await this.create(photo);
  }
}
