import { Address, fromNano, toNano } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { MainContract } from '../build/MainContract/tact_MainContract';

const serialize = (data: unknown) => {
    return JSON.stringify(data, (key, value) => {
            if (Address.isAddress(value)) {
                return Address.normalize(value);
            }
            return typeof value === 'bigint'
                ? fromNano(value)
                : value;
        } // return everything else unchanged
    );
};

export async function run(provider: NetworkProvider, args: string[]) {
    const ui = provider.ui();

    const address = Address.parse(args.length > 0 ? args[0] : await ui.input('Main Contract address'));

    if (!(await provider.isContractDeployed(address))) {
        ui.write(`Error: Contract at address ${address} is not deployed!`);
        return;
    }

    const mainContract = provider.open(MainContract.fromAddress(address));

    await mainContract.send(
        provider.sender(),
        {
            value: toNano('1')
        },
        {
            $$type: 'Deposit',
            upLine: null
        }
    );
    const wallet = provider.sender().address!;
    const balanceInfo = await mainContract.getBalanceInfo(wallet);
    const investorInfo = await mainContract.getInvestorInfo(wallet);

    ui.clearActionPrompt();
    ui.write('balanceInfo: ' + serialize(balanceInfo));
    ui.write('investorInfo: ' + serialize(investorInfo));
}
