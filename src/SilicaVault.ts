import { BigInt } from "@graphprotocol/graph-ts";
import {
    Epoch,
    Epoch as EpochEntity,
    SilicaVault as SilicaVaultEntity
} from "../generated/schema";
  
import { StartNextRound, ProcessWithdraws } from "../generated/SilicaVault/SilicaVault";

export function handleProcessWithdraws(event: ProcessWithdraws): void {
    let silicaVault = SilicaVaultEntity.load(event.address.toHex());
    if (!silicaVault) {
        silicaVault = new SilicaVaultEntity(event.address.toHex());
        silicaVault.save();
    }

    // Store values for next epoch
    let curEpochEntry = new Epoch(event.params.currentRound.toString());
    curEpochEntry.paymentHeldAtWithdraw = event.params.pTokenWithdrawn;
    curEpochEntry.rewardHeldAtWithdraw = event.params.rTokenWithdrawn;
    curEpochEntry.sharesWithdrawn = event.params.sharesWithdrawn;
    curEpochEntry.save();   
}

export function handleStartNextRound(event: StartNextRound): void {
    let silicaVault = SilicaVaultEntity.load(event.address.toHex());
    if (!silicaVault) {
        silicaVault = new SilicaVaultEntity(event.address.toHex());
        silicaVault.save();
    }

    // Store values for next epoch
    let curEpochEntry = new Epoch(event.params.currentRound.toString());
    if (!curEpochEntry) {
        // exit gracefully
    } else {
        curEpochEntry.startTimestamp = event.block.timestamp;
        curEpochEntry.roundEnd = event.params.roundEndDay;
        curEpochEntry.roundSize = event.params.roundSize;
        curEpochEntry.deposited = event.params.deposited;
        curEpochEntry.sharePriceAtStart = event.params.sharePriceAtStart;
        curEpochEntry.shareSupplyAtStart = event.params.shareSupplyAtStart;
        curEpochEntry.silicaVaultV1 = event.address.toHex();
        curEpochEntry.save();
    }
}