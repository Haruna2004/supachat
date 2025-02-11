````js
/*

    New Session
    - Keep asking question until intent is detected
    Intent Detector
    Route Each Intent to Function
     - Init_Pay -> handlePay()
     - Verify_Pay -> verifyPay()
     - Init_Bulk_Pay -> verifyPay()
    - Afer the intent is detecte call the corresponding function

     Handling Payment
     - Keeps asking question until the details needed to initiate
       a payment is complete
     - After that keeps asking question util account is succesfully
       confirmed
     - Afer payment details is comfired: Ask for Approval
     - if Approval is not or it's details is not correct repeat Handle payment
     - If Approval is accepted send the details to an acutall Payment processor
     - End Session

    If user enters RESET, it should reset all details and start as a new session

    */
```js


```js

{

	"title": "First scheduled payment", // required
	"amount": 965000, // required


	"to": {
		"name": "ADEKUNLE CIROMA CHINEDU", // required
		"account_number": "0100000000", // required
		"bank": "bnk_1mHfTTp03uzgVyof2L28lC" // required
	},
}


/*

You can use my sandbox account.
URL: https://app-staging.trybrass.com
Email: philip+staging@trybrass.com
Password: iXLHX2rmrU8nXmd.
https://trybrass.com

You don’t really need the dashboard though since this account is already activated. So you can follow the instructions in the docs[https://trybrass.com] to login, authorize and then generate a Personal Access Token(PAT) on the account.

*/

````

Example bulk payment
demo accounts
Aisha Bello - 3057784216 - GTBank - 150,000
Samuel Okoro - 2145897632 - Access Bank - 300,000

real accounts
Haruna Faruk - 8164475065 - Opay - 3000
Haruna Faruk - 2230663978 - United Bank - 2000

reals account
Samuel Emumena 6115056912 Opay 350,000
AHmed Olayinka 705595701 Palmpay 280,000
Yakubu Kehinde 3053653135 First Bank 1000
Charles Ewa 0074564566 Sterling Bank 180,000
Haruna Faruk 2230663978 United Bank 300,000
Monica Makoko 8023357527 Palmpay 220,000
Apolonia Obiageli 0717970443 Access Bank 220,000
Funmilayo Janet 8900436317 Palmpay 500,000
Sulaiman Miko 80899418733 Opay 400,000
