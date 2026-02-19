import { Test, TestingModule } from '@nestjs/testing';
import { CatalgoController } from './catalgo.controller';
import { CatalgoService } from './catalgo.service';

describe('CatalgoController', () => {
  let controller: CatalgoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalgoController],
      providers: [CatalgoService],
    }).compile();

    controller = module.get<CatalgoController>(CatalgoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
