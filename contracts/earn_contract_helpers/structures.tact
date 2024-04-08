struct ContractMeta {
    founder: Address;
    minDeposit: Int as coins;// 10 TON
    maxDepositMultiplier: Int as uint32;// 100
    rewardsPercent: Int as uint32;// 310
    depositDirectUpLineBonusPercent: Int as uint32;// 10
    depositFounderBonusPercent: Int as uint32;// 1
}

struct Round {
    serial: Int as uint32;
    amount: Int as coins;
    createdAt: Int as uint32;
    claimedAt: Int as uint32;
    isClaimed: Bool;
}

struct Investor {
    address: Address;
    upLine: Address;
    round: Round;
    referralBonus: Int as coins;
}

struct Profile {
    referralBonus: Int as coins;
}
