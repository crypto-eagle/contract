struct Transfer {
    date: Int as uint32;
    amount: Int as coins;
    isDeposit: Bool;
}

struct Investor {
    upLine: Address;
    bonus: Int as coins;
    transfers: map<Int as uint32, Transfer>;
    transfersCount: Int as uint32;
}

struct BalanceInfo {
    totalDeposits: Int as coins;
    totalWithdrawals: Int as coins;
    totalEarns: Int as coins;
    referralBonus: Int as coins;
    dailyIncome: Int as coins;
}
