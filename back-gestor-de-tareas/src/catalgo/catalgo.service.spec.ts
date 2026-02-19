import { Test, TestingModule } from '@nestjs/testing';
import { CatalgoService } from './catalgo.service';

describe('CatalgoService', () => {
  let service: CatalgoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalgoService],
    }).compile();

    service = module.get<CatalgoService>(CatalgoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
