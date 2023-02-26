import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { multerStorage } from 'src/utils';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':name')
  getFile(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    return this.fileService.fetchFile(req, res);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerStorage,
    }),
  )
  uploadSingle(@UploadedFile() file: Express.Multer.File) {
    return this.fileService.uploadFile(file);
  }

  @Post('upload-many')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: multerStorage,
    }),
  )
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    return this.fileService.uploadFiles({ files });
  }

  @Post('delete-many')
  deleteMany(@Body('ids') ids: number[]) {
    return this.fileService.deleteMany(ids);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.fileService.delete({ id: +id });
  }
}
