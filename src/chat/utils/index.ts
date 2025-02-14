export const formatAmount = (amount: number) => {
  if (!amount && amount !== 0) return '0';
  const amountStr = amount.toString().replace(/,/g, '');
  const parts = amountStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  //   return parts.join('.')
  return `₦${parts.join('.')}`;
};

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
