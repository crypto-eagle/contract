import { Address } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';
import { deployFounder } from './deployFounderContract';
import { deployEarn } from './deployEarnContract';

const founders: Address[] = [
    Address.parse('UQAzu4spGaKGMVAslT6JGup-r58EcePLyEZDIuwDvTcvEP5f'),
    Address.parse('UQCi_KQMSO-szmkSl976oqL0e8_L6oGsBLANDYqmg07aZ36X'),
    Address.parse('UQAZt9M1fLbQPnSxvBPEJsRjpyCZtUKPWxoVYXI23jA3o-y7')
];
const mainWallet = 'UQDXX8m8VGBvRHUnMbl4Ai7pucKGF2FCkf6w-GbcLoWh9rjT';

export async function run(provider: NetworkProvider) {
    const contractFounder = await deployFounder(provider, founders);

    await deployEarn(provider, contractFounder.address);

    // run methods on `earnContract`
}
