trait Functions {

    get fun totalBalance(): Int {
        return myBalance();
    }

    fun makeTransfer(amount: Int, isDeposit: Bool): Transfer {
        return Transfer {
           date: now(),
           isDeposit: isDeposit,
           amount: amount
       };
    }
}
