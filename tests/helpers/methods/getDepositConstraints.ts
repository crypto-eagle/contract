import { SandboxContract } from '@ton/sandbox';
import { EarnContract } from '../../../build/EarnContract/tact_EarnContract';
import { Address } from '@ton/core';

export const getDepositConstraints = async (contract: SandboxContract<EarnContract>, address: Address): Promise<{
    min: bigint,
    max: bigint
}> => {
    return await contract.getDepositConstraints(address);
};