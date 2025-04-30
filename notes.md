// async function confirmAccount({
// bankCode,
// accountNumber,
// }: z.infer<typeof comAcctSchema>) {
// const result = await brassService.confirmAccount(
// bankCode,
// accountNumber,
// brassToken,
// );
// if (!result.success) {
// console.log('Confirmation Error', result.error);
// return {
// message: 'There was an error verifying bank details',
// details: result.error,
// };
// }
// console.log(result);
// return result.data;
// }

// async function getBankCode({ detectedBank }: { detectedBank: string }) {
// const { error, validBankName } =
// await aiService.getValidBankName(detectedBank);
// if (error) return { error, code: '' };
// const bankCode = BANK_LIST[validBankName];
// console.log('Resolved Bank Code: ', bankCode, ' from ', detectedBank);

// if (!bankCode)
// return Promise.resolve(
// 'Bank code for the bank name could not be determined, suggest some up to 3 potential nigerian bank they might be refering to',
// );
// return Promise.resolve(bankCode);

// async function processPayment(args: z.infer<typeof paySchema>) {
// const brassPayable: BrassPayable = {
// customer_reference: randomUUID(),
// amount: args.amount \* 100,
// title: `Concierge-${args.title}`,
// source_account: brassAccountId ?? '',
// to: {
// account_number: args.accountNumber,
// bank: args.bankId,
// name: args.name,
// },
// };

// console.log('payment request', brassPayable);

// const result = await brassService.createPayment(brassPayable, brassToken);

// if (!result.success) {
// return Promise.resolve(`Payment was not successfully`);
// }

// return Promise.resolve(
// `Payment of ${args.amount} to ${args.name} created successfully`,
// );
// }

// return {
// confirmAccount: tool({
// description:
// 'Verify and validate bank account details, returning confirmed account information',
// parameters: comAcctSchema,
// execute: confirmAccount,
// }),

// getBankCode: tool({
// description:
// 'Lookup and retrieve the numerical bank code when given a bank name',
// parameters: z.object({
// detectedBank: z
// .string()
// .describe(
// 'The bank name detected from user conversation that needs to be resolved to a code',
// ),
// }),
// execute: getBankCode,
// }),

// processPayment: tool({
// description:
// 'Execute the payment transaction after explicit user approval has been received',
// parameters: paySchema,
// execute: processPayment,
// }),
// };
