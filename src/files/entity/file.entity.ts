import { CosmosPartitionKey, CosmosDateTime } from '@nestjs/azure-database';

@CosmosPartitionKey('type')
export class File {
  userName: string;
  filename: string;
  text: string;
  @CosmosDateTime() createdAt: Date;
}
