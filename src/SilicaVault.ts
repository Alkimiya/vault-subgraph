import { BigInt } from "@graphprotocol/graph-ts";
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

    // Store values for next epoch
    let curEpochEntry = new Epoch(event.params.currentRound.toString());
    curEpochEntry.startTimestamp = event.block.timestamp;
    curEpochEntry.roundEnd = event.params.roundEndDay;
    curEpochEntry.roundSize = event.params.roundSize;
    curEpochEntry.deposited = event.params.deposited;
    curEpochEntry.sharePriceAtStart = event.params.sharePriceAtStart;
    curEpochEntry.shareSupplyAtStart = event.params.shareSupplyAtStart;
    curEpochEntry.silicaVaultV1 = event.address.toHex();
    curEpochEntry.save();

    // Update fields for previous epoch
    let prevEpoch = event.params.currentRound.minus(new BigInt(1));
    let prevEpochEntry = EpochEntity.load(prevEpoch.toString());
    if (!prevEpochEntry) {
        // handle null gracefully
    } else {
        prevEpochEntry.paymentHeldAtWithdraw = event.params.paymentHeldAtWithdraw;
        prevEpochEntry.rewardHeldAtWithdraw = event.params.rewardHeldAtWithdraw;
        prevEpochEntry.sharesWithdrawn = event.params.sharesWithdrawn;
        prevEpochEntry.save();   
    }

}