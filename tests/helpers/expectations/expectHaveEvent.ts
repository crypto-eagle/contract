import { SandboxContract, SendMessageResult, TreasuryContract } from '@ton/sandbox';
import { EarnContract } from '../../../build/EarnContract/tact_EarnContract';
import { EventMessageSent } from '@ton/sandbox/dist/event/Event';
import { FounderContract } from '../../../build/FounderContract/tact_FounderContract';

export const expectNotHaveEvents = (result: SendMessageResult) => {
    expect(result.events.length).toBeFalsy();
};

export const expectHaveFailEvents = (result: SendMessageResult) => {
    expect(result.events.length).toBe(2);

    const events = result.events as EventMessageSent[];

    const notBouncedEvent = events.find(e => !e.bounced);
    const bouncedEvent = events.find(e => e.bounced);

    expect(notBouncedEvent).toBeTruthy();
    expect(bouncedEvent).toBeTruthy();
};

export const expectHaveOnlyOneEvent = (contract: SandboxContract<EarnContract | FounderContract>, deployer: SandboxContract<TreasuryContract>, result: SendMessageResult, value: bigint) => {
    expect(result.events.length).toBe(1);

    const msg = result.events[0] as EventMessageSent;

    expect(msg.value).toBe(value);
    expect(JSON.stringify(msg.from)).toBe(JSON.stringify(deployer.address));
    expect(JSON.stringify(msg.to)).toBe(JSON.stringify(contract.address));
};
