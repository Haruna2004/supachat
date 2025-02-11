export function FineTerminal() {
  console.log('\x1b[34m==========================================\x1b[0m');
  console.log('\x1b[32m        BULK PAYMENT DETAILS REQUIRED\x1b[0m');
  console.log('\x1b[34m==========================================\x1b[0m');

  console.log('\n\x1b[37mPlease provide the following details:\x1b[0m');

  console.log('\x1b[36m1️⃣ Account Name\x1b[0m');
  console.log('\x1b[36m2️⃣ Account Number\x1b[0m');
  console.log('\x1b[36m3️⃣ Bank Name\x1b[0m');
  console.log('\x1b[36m4️⃣ Amount\x1b[0m');

  console.log('\n\x1b[33m➡️ Format:\x1b[0m');
  console.log('   Name - Number - Bank - Amount');
  console.log('   Example:');
  console.log('   \x1b[32mHaruna Faruk - 882828292928 - UBA - 200,000\x1b[0m');
  console.log(
    '   \x1b[32mHaruna Faruk - 882828292928 - Access - 200,000\x1b[0m',
  );

  console.log(
    '\n\x1b[35m✅ Tip: Process about 10 at a time for easier error checking.\x1b[0m',
  );

  console.log('\x1b[34m==========================================\x1b[0m');
}

export const BULK_PAY_MESSAGE = `
==========================================
        BULK PAYMENT DETAILS REQUIRED
==========================================

Here are the details required:

1️⃣  Account Name  
2️⃣  Account Number  
3️⃣  Bank Name  
4️⃣  Amount  

➡️ Please follow this format:  
   Name - Number - Bank - Amount  
   Example:  
   Haruna Faruk - 88282829292 - UBA - 200,000  
   Njoku Samuel - 88282829292 - Access - 200,000

✅ Tip: Process about 30 at a time for easier error checking.  

========================================== 

`;

export const bankNameCorpus =
  'Access Bank,CitiBank,Diamond Bank,Ecobank Plc,Enterprise Bank,First Bank of Nigeria,First City Monument Bank,Globus Bank,GTBank Plc,Heritage Bank,Keystone Bank,Lotus Bank,Polaris Bank,PremiumTrust Bank,ProvidusBank PLC,SIGNATURE BANK,Standard Chartered Bank,Sterling Bank,Stanbic IBTC Bank,SunTrust Bank,Titan Trust Bank,United Bank for Africa,Union Bank,Wema Bank,Zenith Bank,3Line Card Management Limited,9 Payment Service Bank,Access Money,Beta-Access Yello,Capricorn Digital,Cellulant,Cellulant Pssp,Contec Global Infotech Limited (NowNow),eTranzact,Eartholeum,EcoMobile,FBNMobile,FET,Fidelity Mobile,First Apple Limited,Flutterwave Technology Solutions Limited,FortisMobile,GoMoney,GTMobile,Hedonmark,Hopepsb,Intellifin,Interswitch Financial Inclusion Services (Ifis),Interswitch Limited,Kadick Integration Limited,Kegow,Koraypay,M36,Mkudi,Momo Psb,MoneyBox,Money Master Psb,Netapps Technology Limited,Nibssussd Payments,Nomba Financial Services Limited,One Finance,Opay,Pagatech,PALMPAY,Moniepoint, Kuda, PayAttitude Online,Paycom,Paystack Payments Limited,Qr Payments,ReadyCash (Parkway),Resident Fintech Limited,Smartcash Payment Service Bank,Spay Business,Stanbic Mobile Money,Stanbic IBTC @ease wallet,TagPay,Tajwallet,TeasyMobile,TeamApt,Titan-Paystack,Vas2Nets Limited,Venture Garden Nigeria Limited,VTNetworks,Woven Finance,Xpress Payments,Yello Digital Financial Services,ZenithMobile,Zinternet Nigera Limited,Zwallet,Opay,Stanbic Mobile Money,FortisMobile,TagPay,FBNMobile,Sterling Mobile,ReadyCash (Parkway),ZenithMobile,EcoMobile,Fidelity Mobile,TeasyMobile,ChamsMobile,PayAttitude Online,GTMobile,Mkudi';
