import {
    Epoch,
    Epoch as EpochEntity,
    SilicaVault as SilicaVaultEntity
} from "../generated/schema";
  
import { StartNextRound } from "../generated/SilicaVault/SilicaVault";

export function handleStartNextRound(event: StartNextRound): void {
    let silicaVault = SilicaVaultEntity.load(event.address.toHex());
    if (!silicaVault) {
        silicaVault = new SilicaVaultEntity(event.address.toHex());
        silicaVault.save();
    }

    let epochEntry = new Epoch(event.params.currentRound.toString());
    epochEntry.startTimestamp = event.block.timestamp;
    epochEntry.roundEnd = event.params.roundEndDay;
    epochEntry.roundSize = event.params.roundSize;
    epochEntry.deposited = event.params.deposited;
    epochEntry.sharePriceAtStart = event.params.sharePriceAtStart;
    epochEntry.shareSupplyAtStart = event.params.shareSupplyAtStart;
    epochEntry.paymentHeldAtWithdraw = event.params.paymentHeldAtWithdraw;
    epochEntry.rewardHeldAtWithdraw = event.params.rewardHeldAtWithdraw;
    epochEntry.sharesWithdrawn = event.params.sharesWithdrawn;
    epochEntry.silicaVaultV1 = event.address.toHex();
}
  
// export function handleOracleUpdate(event: OracleUpdate): void {
//     let oracle = OracleMiningEntity.load(event.address.toHex());
//     if (!oracle) {
//       oracle = new OracleMiningEntity(event.address.toHex());
//       oracle.save();
//     }
  
//     let oracleMiningEntry = new OracleMiningEntryEntity(
//       oracle.id + "-" + event.params.referenceDay.toHex()
//     );
//     oracleMiningEntry.referenceDay = event.params.referenceDay;
//     oracleMiningEntry.referenceBlock = event.params.referenceBlock;
//     oracleMiningEntry.hashrate = event.params.hashrate;
//     oracleMiningEntry.reward = event.params.reward;
//     oracleMiningEntry.fees = event.params.fees;
//     oracleMiningEntry.difficulty = event.params.difficulty;
  
//     // set derived field
//     oracleMiningEntry.oracle = event.address.toHex();
  
//     oracleMiningEntry.save();
//   }
  