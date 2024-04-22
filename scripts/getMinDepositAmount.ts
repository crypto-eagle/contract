import { Address, fromNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { EarnContract } from '../build/EarnContract/tact_EarnContract';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Earn Contract address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);

        return;
    }

    const earnContract = provider.open(EarnContract.fromAddress(address));

    const minDepositAmount = await earnContract.getMinDepositAmount(provider.sender().address!);

    ui.clearActionPrompt();
    ui.write('minDepositAmount: ' + fromNano(minDepositAmount));
}
