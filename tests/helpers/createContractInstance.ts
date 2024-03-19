import { Blockchain } from '@ton/sandbox';
import { MainContract } from '../../build/MainContract/tact_MainContract';
import { toNano } from '@ton/core';
import { minDeposit } from './consts';

export const createContractInstance = async () => {
    const blockchain = await Blockchain.create();
    // blockchain.verbosity = {
    //     print: true,
    //     blockchainLogs: true,
    //     vmLogs: 'vm_logs_location',
    //     debugLogs: true,
    // };

    const contract = blockchain.openContract(await MainContract.fromInit(2n, minDeposit));
    const deployer = await blockchain.treasury('deployer');

    const deployResult = await contract.send(
        deployer.getSender(),
        {
            value: toNano('0.05')
        },
        {
            $$type: 'Deploy',
            queryId: 0n
        }
    );

    expect(deployResult.transactions).toHaveTransaction({
        from: deployer.address,
        to: contract.address,
        deploy: true,
        success: true
    });

    return {contract, deployer};
};
