struct ContractMeta {
    founder: Address;
    minDeposit: Int as coins;// 10 TON
    maxDepositMultiplier: Int as uint8;// 100
    rewardsPercent: Int as uint32;// 310
    depositDirectUpLineBonusPercent: Int as uint8;// 10
    depositFounderBonusPercent: Int as uint8;// 1
}

struct Round {
    serial: Int as uint8;
    amount: Int as coins;
    createdAt: Int as uint32;
    isClaimed: Bool;
    claimedDailyIncome: Int as coins;
}

struct Investor {
    address: Address;
    upLine: Address;
    round: Round;
    referralBonus: Int as coins;
    totalDeposit: Int as coins;
    totalClaimedRewards: Int as coins;
    totalReferralBonus: Int as coins;
}
