import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const { content, imageUrl, authorId } = createPostDto;

    const newPost = await this.prisma.post.create({
      data: {
        content,
        imageUrl,
        author: {
          connect: { id: authorId },
        },
      },
      include: { author: true },
    });

    return plainToInstance(PostResponseDto, newPost);
  }

  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.prisma.post.findMany({
      include: { author: true },
    });
    return plainToInstance(PostResponseDto, posts);
  }

  async findOne(id: string): Promise<PostResponseDto | null> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });
    return plainToInstance(PostResponseDto, post);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });

    return plainToInstance(PostResponseDto, updatedPost);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.post.delete({
      where: { id },
    });

    return;
  }
}
