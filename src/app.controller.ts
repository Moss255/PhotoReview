import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Render,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { readFileSync } from 'fs';
import { ReviewDto } from './dto/review.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('upload')
  @Render('upload')
  showUploadPhoto() {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './data/uploads',
        filename: (req, file, cb) => {
          // You can customize the filename here
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const fileExtension = file.mimetype.split('/')[1];
          cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`);
        },
      }),
    }),
  )
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    const id = crypto.randomUUID();
    const photo = await this.appService.create({
      id: id,
      filePath: file.path,
      result: 'pending',
      mimetype: file.mimetype,
    });
    return photo.id;
  }

  @Render('status')
  @Get('status/:photoId')
  async getStatusOfPhoto(@Param('photoId') photoId: string) {
    const photoData = await this.appService.findOne(photoId);
    const photo = readFileSync(photoData.filePath).toString('base64');
    return {
      ...photoData,
      photo: `data:${photoData.mimetype};base64,${photo}`,
      isPending: photoData.result === 'pending',
      isYes: photoData.result === 'yes',
      isNo: photoData.result === 'no',
    };
  }

  @Render('review')
  @Get('review/:photoId')
  async getReviewForm(@Param('photoId') photoId: string) {
    const photoData = await this.appService.findOne(photoId);
    const photo = readFileSync(photoData.filePath).toString('base64');
    return {
      ...photoData,
      photo: `data:${photoData.mimetype};base64,${photo}`,
      isPending: photoData.result === 'pending',
    };
  }

  @Render('thanks')
  @Post('review/:photoId')
  async actionReview(
    @Param('photoId') photoId: string,
    @Body() body: ReviewDto,
  ) {
    await this.appService.updateCursedStatus(photoId, body.response);
    return {
      response: body.response,
    };
  }
}
