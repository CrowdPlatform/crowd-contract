import { any, string } from "hardhat/internal/core/params/argumentTypes"

export class ContractError{
    reason: string = "";
    code : string = "";
    error: any;
    tx : any;
}