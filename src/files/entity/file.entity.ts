import { CosmosPartitionKey, CosmosDateTime, CosmosUniqueKey } from '@dinohorvat/azure-database'

@CosmosPartitionKey('type')
export class File {
  userName: string;
  @CosmosUniqueKey() filename: string;
  text: string;
  @CosmosDateTime() createdAt: Date;
}
