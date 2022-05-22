// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Paused extends ethereum.Event {
  get params(): Paused__Params {
    return new Paused__Params(this);
  }
}

export class Paused__Params {
  _event: Paused;

  constructor(event: Paused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class SuperStaked extends ethereum.Event {
  get params(): SuperStaked__Params {
    return new SuperStaked__Params(this);
  }
}

export class SuperStaked__Params {
  _event: SuperStaked;

  constructor(event: SuperStaked) {
    this._event = event;
  }

  get stethShares(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class Unpaused extends ethereum.Event {
  get params(): Unpaused__Params {
    return new Unpaused__Params(this);
  }
}

export class Unpaused__Params {
  _event: Unpaused;

  constructor(event: Unpaused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class SuperStaker extends ethereum.SmartContract {
  static bind(address: Address): SuperStaker {
    return new SuperStaker("SuperStaker", address);
  }

  executeOperation(
    assets: Array<Address>,
    amounts: Array<BigInt>,
    premiums: Array<BigInt>,
    initiator: Address,
    params: Bytes
  ): boolean {
    let result = super.call(
      "executeOperation",
      "executeOperation(address[],uint256[],uint256[],address,bytes):(bool)",
      [
        ethereum.Value.fromAddressArray(assets),
        ethereum.Value.fromUnsignedBigIntArray(amounts),
        ethereum.Value.fromUnsignedBigIntArray(premiums),
        ethereum.Value.fromAddress(initiator),
        ethereum.Value.fromBytes(params)
      ]
    );

    return result[0].toBoolean();
  }

  try_executeOperation(
    assets: Array<Address>,
    amounts: Array<BigInt>,
    premiums: Array<BigInt>,
    initiator: Address,
    params: Bytes
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "executeOperation",
      "executeOperation(address[],uint256[],uint256[],address,bytes):(bool)",
      [
        ethereum.Value.fromAddressArray(assets),
        ethereum.Value.fromUnsignedBigIntArray(amounts),
        ethereum.Value.fromUnsignedBigIntArray(premiums),
        ethereum.Value.fromAddress(initiator),
        ethereum.Value.fromBytes(params)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  paused(): boolean {
    let result = super.call("paused", "paused():(bool)", []);

    return result[0].toBoolean();
  }

  try_paused(): ethereum.CallResult<boolean> {
    let result = super.tryCall("paused", "paused():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  pool(): Address {
    let result = super.call("pool", "pool():(address)", []);

    return result[0].toAddress();
  }

  try_pool(): ethereum.CallResult<Address> {
    let result = super.tryCall("pool", "pool():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  referral(): Address {
    let result = super.call("referral", "referral():(address)", []);

    return result[0].toAddress();
  }

  try_referral(): ethereum.CallResult<Address> {
    let result = super.tryCall("referral", "referral():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  steth(): Address {
    let result = super.call("steth", "steth():(address)", []);

    return result[0].toAddress();
  }

  try_steth(): ethereum.CallResult<Address> {
    let result = super.tryCall("steth", "steth():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  weth(): Address {
    let result = super.call("weth", "weth():(address)", []);

    return result[0].toAddress();
  }

  try_weth(): ethereum.CallResult<Address> {
    let result = super.tryCall("weth", "weth():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _weth(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _steth(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _pool(): Address {
    return this._call.inputValues[2].value.toAddress();
  }

  get _referral(): Address {
    return this._call.inputValues[3].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class DefaultCall extends ethereum.Call {
  get inputs(): DefaultCall__Inputs {
    return new DefaultCall__Inputs(this);
  }

  get outputs(): DefaultCall__Outputs {
    return new DefaultCall__Outputs(this);
  }
}

export class DefaultCall__Inputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class DefaultCall__Outputs {
  _call: DefaultCall;

  constructor(call: DefaultCall) {
    this._call = call;
  }
}

export class ExecuteOperationCall extends ethereum.Call {
  get inputs(): ExecuteOperationCall__Inputs {
    return new ExecuteOperationCall__Inputs(this);
  }

  get outputs(): ExecuteOperationCall__Outputs {
    return new ExecuteOperationCall__Outputs(this);
  }
}

export class ExecuteOperationCall__Inputs {
  _call: ExecuteOperationCall;

  constructor(call: ExecuteOperationCall) {
    this._call = call;
  }

  get assets(): Array<Address> {
    return this._call.inputValues[0].value.toAddressArray();
  }

  get amounts(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get premiums(): Array<BigInt> {
    return this._call.inputValues[2].value.toBigIntArray();
  }

  get initiator(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get params(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class ExecuteOperationCall__Outputs {
  _call: ExecuteOperationCall;

  constructor(call: ExecuteOperationCall) {
    this._call = call;
  }

  get value0(): boolean {
    return this._call.outputValues[0].value.toBoolean();
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class StakeCall extends ethereum.Call {
  get inputs(): StakeCall__Inputs {
    return new StakeCall__Inputs(this);
  }

  get outputs(): StakeCall__Outputs {
    return new StakeCall__Outputs(this);
  }
}

export class StakeCall__Inputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }

  get factor(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class StakeCall__Outputs {
  _call: StakeCall;

  constructor(call: StakeCall) {
    this._call = call;
  }
}

export class SuperStakeCall extends ethereum.Call {
  get inputs(): SuperStakeCall__Inputs {
    return new SuperStakeCall__Inputs(this);
  }

  get outputs(): SuperStakeCall__Outputs {
    return new SuperStakeCall__Outputs(this);
  }
}

export class SuperStakeCall__Inputs {
  _call: SuperStakeCall;

  constructor(call: SuperStakeCall) {
    this._call = call;
  }

  get shares(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get factor(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SuperStakeCall__Outputs {
  _call: SuperStakeCall;

  constructor(call: SuperStakeCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}
