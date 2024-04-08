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
    totalDeposit: Int as coins;
    totalClaimedRewards: Int as coins;
    totalReferralBonus: Int as coins;
}

struct Profile {
    totalDeposit: Int as coins;
    totalClaimedRewards: Int as coins;
    totalReferralBonus: Int as coins;
    currentRound: Int as uint32;
    currentDeposit: Int as coins;
    currentReferralBonus: Int as coins;
    currentDailyIncome: Int as coins;
}
