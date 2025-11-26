/*
 * @Description:
 * @Autor: yjp
 * @Date: 2025-11-26 15:37:18
 * @LastEditors: yjp
 * @LastEditTime: 2025-11-26 15:45:03
 * @FilePath: /yjp-about-chain/subgraph/src/mapping.ts
 */
import { InfoStored as InfoStoredEvent } from "../generated/InfoContract/InfoContract";
import { InfoStored } from "../generated/schema";

export function handleInfoStored(event: InfoStoredEvent): void {
  let entity = new InfoStored(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );

  entity.sender = event.params.sender;
  entity.name = event.params.name;
  entity.data = event.params.data;
  entity.timestamp = event.params.timestamp;
  entity.blockNumber = event.block.number;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
