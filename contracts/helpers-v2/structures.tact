struct Round {
    openDate: Int as uint32;
    deposit: Int as coins;
}

struct ContractMeta {
    // уникальный идентификатор контракта
    id: Int as uint32;
    // адрес роялти
    founder: Address;
    // минимальный депозит
    minDeposit: Int as coins;
    // множитель круга
    roundMultiplier: Int as uint8;
    // множитель максимального депозита
    maxDepositMultiplier: Int as uint8;
    // все участники
    investors: map<Address, Investor>;
    // система бонусов
    bonusSystem: map<Int, Int>;
}

struct Investor {
    // Реферал
    upLine: Address;
    // Адрес кошелька инвестора, на который будет отправлять Contract.claimRewards(Investor).
    address: Address;
    /*
        Общая сумма ежедневного пассивного дохода за предыдущие Investor.round.
        Увеличиваем после каждого депозита при увеличении Investor.round до изменения Investor.lastDepositAmount на Contract.getDailyIncome(Investor).
        Уменьшаем после каждого успешного Contract.claimRewards(Investor) на сумму задействованную для отправки.
    */
    dailyIncome: Int as coins;
    dailyIncomeHistorical: Int as coins;
    /*
        Общая сумма полученных за все время бонусов от рефералов.
        Увеличивается по маркетинг условиям(прямой депозит и вывод от рефералов).
        Уменьшается после каждого успешного вызова Contract.claimRewards(Investor) на сумму задействованную для отправки.
    */
    bonus: Int as coins;
    bonusHistorical: Int as coins;

    /* Порядковый номер цикла, по сути количество внесенных Deposit.amount.
       Увеличиваем на 1 после каждого депозита. */
    round: Int as uint8;
    // Текущий круг
    currentRound: Round?;
}
