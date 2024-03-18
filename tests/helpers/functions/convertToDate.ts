export const convertToDate = (unixDate: BigInt): Date => {
    return new Date(Number(unixDate) * 1000);
};
