import { BigInt } from "@graphprotocol/graph-ts"
import {
  SuperStaker,
  OwnershipTransferred,
  Paused,
  SuperStaked,
  Unpaused
} from "../generated/SuperStaker/SuperStaker"
import { TotalStaked } from "../generated/schema"


export function handleSuperStaked(event: SuperStaked): void {
  let id = "total";
  let staked = TotalStaked.load(id)
  if (staked == null) {
    staked = new TotalStaked(id)
  }
  staked.total += event.params.stethShares
  staked.save()
}

