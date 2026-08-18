import { Test, TestingModule } from '@nestjs/testing';
import { ZipfilesService } from './zipfiles.service';

describe('ZipfilesService', () => {
  let service: ZipfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZipfilesService],
    }).compile();

    service = module.get<ZipfilesService>(ZipfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
