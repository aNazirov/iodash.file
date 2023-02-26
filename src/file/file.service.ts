import { PrismaService } from '@libs/prisma';
import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { unlink } from 'fs/promises';
import { ErrorHandler } from 'src/utils';

interface Args {
  files: Express.Multer.File[];
}

@Injectable()
export class FileService {
  private readonly logger = new Logger('FileService');

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async fetchFile(req: Request, res: Response) {
    const file = await this.prisma.file.findUnique({
      where: { name: req.params.name },
    });

    if (!file) return ErrorHandler(404, null, 'File not found');

    if (req.headers['range']) {
      const range = req.headers.range;
      const parts = range.replace(/bytes=/, '').split('-');
      const partialstart = parts[0];
      const partialend = parts[1];

      const start = parseInt(partialstart, 10);
      const end = partialend ? parseInt(partialend, 10) : file.size - 1;
      const chunksize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': 'bytes ' + start + '-' + end + '/' + file.size,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': file.mimeType,
      });

      return new StreamableFile(
        createReadStream(file.path, { start: start, end: end }),
      );
    } else {
      res.writeHead(200, {
        'Content-Length': file.size,
        'Content-Type': file.mimeType,
      });

      return new StreamableFile(createReadStream(file.path));
    }
  }

  async uploadFile(file: Express.Multer.File) {
    if (Array.isArray(file)) {
      file = file[0];
    }

    return this.prisma.file.create({
      data: {
        name: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
        url: `${this.config.get('host')}/file/${file.filename}`,
        path: file.path,
      },
    });
  }

  async uploadFiles({ files }: Args) {
    const requests = files.map((x) => {
      return this.prisma.file.create({
        data: {
          name: x.filename,
          originalName: x.originalname,
          size: x.size,
          mimeType: x.mimetype,
          url: `${this.config.get('host')}/file/${x.filename}`,
          path: x.path,
        },
      });
    });

    return this.prisma.$transaction(requests);
  }

  async deleteMany(ids: number[]) {
    const files = await this.prisma.file.findMany({
      where: { id: { in: ids } },
    });

    if (files.length) {
      await this.prisma.file.deleteMany({
        where: { id: { in: files.map((x) => x.id) } },
      });

      for (let i = 0; i < files.length; i++) {
        try {
          await unlink(files[i].path);
        } catch (e) {
          this.logger.error(e);
        }
      }
    }

    return {
      status: 200,
      messsage: 'Success',
    };
  }

  async delete(where: Prisma.FileWhereUniqueInput) {
    const file = await this.prisma.file.delete({ where });

    if (file) {
      try {
        await unlink(file.path);
      } catch (e) {
        this.logger.error(e);
      }
    }

    return {
      status: 200,
      messsage: 'Success',
    };
  }
}
