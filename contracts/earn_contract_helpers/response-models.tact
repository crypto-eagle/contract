struct DepositConstraintsResponse {
    min: Int as coins;
    max: Int as coins;
}

struct ProfileTotals {
    deposit: Int as coins;
    claimed: Int as coins;
    referalBonus: Int as coins;
}

struct ProfileCurrentRound {
    deposit: Int as coins;
    claimedAmount: Int as coins;
    secondsPast: Int as uint32;
    earnedAmount: Int as coins;
    earnedPercent: Int as uint8;
}

struct ProfileDataResponse {
    canDeposit: Bool;
    refAddress: Address;
    upLine: Address;
    total: ProfileTotals;
    current: ProfileCurrentRound;
}
