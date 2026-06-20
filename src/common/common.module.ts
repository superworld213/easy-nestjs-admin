import { Global, Module } from '@nestjs/common';

import { MemoryStoreService } from './repositories/memory-store.service';

@Global()
@Module({
  providers: [MemoryStoreService],
  exports: [MemoryStoreService],
})
export class CommonModule {}
