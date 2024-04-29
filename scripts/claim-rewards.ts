import { Address, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { FounderContract } from '../build/FounderContract/tact_FounderContract';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Founder Contract address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);

        return;
    }

    const founderContract = provider.open(FounderContract.fromAddress(address));

    const result = await founderContract.send(
        provider.sender(),
        {
            value: toNano(0),
            bounce: true
        },
        {
            $$type: "ClaimStakeHoldersRewards"
        }
    );

    ui.clearActionPrompt();
    console.log('result', result);
}
