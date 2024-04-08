import '@ton/test-utils';
import { Blockchain } from '@ton/sandbox';
import { EarnContract } from '../../build/EarnContract/tact_EarnContract';
import { minDeposit } from './consts';

export const createEarnContractInstance = async () => {
    const blockchain = await Blockchain.create();
    // blockchain.verbosity = {
    //     print: true,
    //     blockchainLogs: true,
    //     vmLogs: 'vm_logs_location',
    //     debugLogs: true,
    // };

    const founderContract = await blockchain.treasury('founder');
    const contract = blockchain.openContract(
        await EarnContract.fromInit(
            BigInt(Math.floor(Math.random() * 10000)),
            founderContract.address,
            minDeposit,
            100n,
            310n,
            10n,
            1n
        )
    );
    const deployer = await blockchain.treasury('deployer');

    const deployResult = await contract.send(
        deployer.getSender(),
        {
            value: minDeposit
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

    return {contract, deployer, blockchain, founderContract};
};
