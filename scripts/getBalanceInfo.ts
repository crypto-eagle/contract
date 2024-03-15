import { Address, toNano } from '@ton/core';
import { SimpleCounter } from '../wrappers/SimpleCounter';
import { NetworkProvider, sleep } from '@ton/blueprint';
import { MainContract } from '../build/MainContract/tact_MainContract';

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Main Contract address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const mainContract = provider.open(MainContract.fromAddress(address));

    const balanceInfo = await mainContract.getBalanceInfo()

    ui.clearActionPrompt();
    ui.write('balanceInfo: ' + JSON.stringify(balanceInfo));
}
