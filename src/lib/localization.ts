import { gregorianToEthiopian } from "../utils/ethiopianCalendar";

export type Language = "en" | "am" | "om" | "ti";
export type CalendarType = "gregorian" | "ethiopian";

export interface TranslationDictionary {
  nav: {
    solutions: string;
    training: string;
    portfolio: string;
    aiConsultant: string;
    tickets: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    ctaConsultation: string;
    ctaQuote: string;
    experience: string;
  };
  solutions: {
    heading: string;
    subheading: string;
    problem: string;
    impact: string;
    solution: string;
    benefits: string;
    approach: string;
    whoFor: string;
    process: string;
    related: string;
    relevantProjects: string;
    faq: string;
    specifications: string;
    requestQuote: string;
    requestConsult: string;
  };
  training: {
    heading: string;
    subheading: string;
    gainedSkills: string;
    syllabus: string;
    level: string;
    mode: string;
    register: string;
  };
  portfolio: {
    heading: string;
    subheading: string;
    challenge: string;
    solution: string;
    implementation: string;
    result: string;
    installedHardware: string;
    techInvolved: string;
    auditedResults: string;
    similarChallenge: string;
  };
  common: {
    back: string;
    loading: string;
    search: string;
    clear: string;
    required: string;
    success: string;
    error: string;
    submit: string;
    cancel: string;
  };
  payment: {
    heading: string;
    methods: string;
    verify: string;
    status: string;
    initiate: string;
    currencySymbol: string;
    currencyCode: string;
  };
  form: {
    name: string;
    email: string;
    organization: string;
    phone: string;
    details: string;
    urgency: string;
    budget: string;
    validationRequired: string;
    validationEmail: string;
    validationPhone: string;
    successTitle: string;
    successDesc: string;
    errorTitle: string;
    errorDesc: string;
  };
  empty: {
    noResults: string;
    noTickets: string;
  };
  metadata: {
    title: string;
    description: string;
  };
}

export const DICTIONARIES: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      solutions: "Business Solutions",
      training: "Training Academy",
      portfolio: "Case Studies",
      aiConsultant: "AI Consultant",
      tickets: "Ticket Tracker"
    },
    hero: {
      badge: "Commercial ICT & Hardware Systems in East Africa",
      title: "Enterprise Technology Built for Real Operational Proof",
      subtitle: "Over 8 years of certified engineering expertise in biometric security networks, structured gigabit cabling, and vehicle fleet telemetry across Africa.",
      ctaConsultation: "Request a Consultation",
      ctaQuote: "Request a Quote",
      experience: "8+ Years Audited Experience"
    },
    solutions: {
      heading: "Technical Business Solutions",
      subheading: "Vulnerabilities parsed, engineered, and resolved. High-integrity configurations for modern workspaces.",
      problem: "Customer Problem",
      impact: "Business Impact",
      solution: "Syntax Technology Solution",
      benefits: "Key Benefits",
      approach: "Implementation Approach",
      whoFor: "Who the Solution is For",
      process: "Deploy-to-Live Process",
      related: "Related Systems",
      relevantProjects: "Relevant Projects & Proofs",
      faq: "Frequently Asked Questions",
      specifications: "Technical Specs",
      requestQuote: "Request a Quote",
      requestConsult: "Request a Consultation"
    },
    training: {
      heading: "Technical Training Academy",
      subheading: "Acquire verified physical configuration capabilities with real-world equipment. No theoretical clutter.",
      gainedSkills: "Aquired Skills",
      syllabus: "What you will configure",
      level: "Skill Level",
      mode: "Delivery Mode",
      register: "Register & Book Seat"
    },
    portfolio: {
      heading: "Case Studies & Project Proofs",
      subheading: "Explore verified commercial installations, system specifications, and audited operational results completed by Syntax field technicians.",
      challenge: "Customer Challenge",
      solution: "Syntax Technology Solution",
      implementation: "Scope of Work & Interactive Blueprint Map",
      result: "Audited Outcomes",
      installedHardware: "Installed Hardware",
      techInvolved: "Technologies Involved",
      auditedResults: "Audited Results",
      similarChallenge: "Have a Similar Challenge?"
    },
    common: {
      back: "Back to Overview",
      loading: "Processing, please wait...",
      search: "Search database...",
      clear: "Clear All Filters",
      required: "This field is required",
      success: "Action completed successfully!",
      error: "An unexpected error occurred. Please try again.",
      submit: "Submit Request",
      cancel: "Cancel"
    },
    payment: {
      heading: "Secure Chapa & Telebirr Payment Hub",
      methods: "Ethiopian Payment Gateways",
      verify: "Verify Payment",
      status: "Payment Status",
      initiate: "Initiate Secure Payment",
      currencySymbol: "ብር ",
      currencyCode: "ETB"
    },
    form: {
      name: "Your Name",
      email: "Business Email",
      organization: "Company / Organization",
      phone: "Phone Number",
      details: "Detailed Requirements / Scope Description",
      urgency: "Project Urgency",
      budget: "Project Budget",
      validationRequired: "This field is required.",
      validationEmail: "Please enter a valid business email.",
      validationPhone: "Please enter a valid phone number (+251...).",
      successTitle: "Form Submitted Successfully!",
      successDesc: "We have received your configuration request. A field engineer will review it shortly.",
      errorTitle: "Submission Error",
      errorDesc: "Could not complete submission. Please check your network and try again."
    },
    empty: {
      noResults: "No matched solutions or configurations found.",
      noTickets: "No active hardware engineering tickets found."
    },
    metadata: {
      title: "Syntax Technology",
      description: "Enterprise IT infrastructure, biometric security, and professional training in East Africa."
    }
  },
  am: {
    nav: {
      solutions: "የንግድ መፍትሔዎች",
      training: "የስልጠና አካዳሚ",
      portfolio: "የተግባር ማስረጃዎች",
      aiConsultant: "የአይአይ አማካሪ",
      tickets: "የትኬት መከታተያ"
    },
    hero: {
      badge: "በምስራቅ አፍሪካ አስተማማኝ የኮምፒውተር መረብ እና ደህንነት መፍትሔዎች",
      title: "እውነተኛ የስራ ማስረጃ ያለው የኢንተርፕራይዝ ቴክኖሎጂ",
      subtitle: "ባዮሜትሪክ የደህንነት መረቦች፣ የተዋቀሩ የጊጋቢት ኬብሎች እና የተሽከርካሪ ፍሊት ክትትል ላይ ከ8 ዓመት በላይ የተረጋገጠ ምህንድስና ልምድ በአፍሪካ።",
      ctaConsultation: "ምክር ይጠይቁ",
      ctaQuote: "ዋጋ ይጠይቁ",
      experience: "ከ8+ ዓመት በላይ የተግባር ልምድ"
    },
    solutions: {
      heading: "ቴክኒካዊ የንግድ መፍትሔዎች",
      subheading: "ክፍተቶች ተለይተው በቴክኖሎጂ የተፈቱበት። ለዘመናዊ የሥራ ቦታዎች ከፍተኛ ታማኝነት ያላቸው ውቅሮች።",
      problem: "የደንበኛው ችግር",
      impact: "በንግዱ ላይ ያለው ተጽዕኖ",
      solution: "የሲንታክስ ቴክኖሎጂ መፍትሔ",
      benefits: "ዋና ዋና ጥቅሞች",
      approach: "የአተገባበር ስልት",
      whoFor: "መፍትሔው ለማን የተዘጋጀ ነው",
      process: "የአተገባበር ቅደም-ተከተል",
      related: "ተዛማጅ ስርዓቶች",
      relevantProjects: "ተዛማጅ ፕሮጀክቶች እና ማስረጃዎች",
      faq: "ተደጋግመው የሚጠየቁ ጥያቄዎች",
      specifications: "ቴክኒካዊ ዝርዝሮች",
      requestQuote: "ዋጋ ይጠይቁ",
      requestConsult: "ምክር ይጠይቁ"
    },
    training: {
      heading: "ቴክኒካዊ ስልጠና አካዳሚ",
      subheading: "ከእውነተኛ ሃርድዌር ጋር በተግባር የተደገፈ የስራ ክህሎት ይቅሰሙ። ያለ ቲዎሪ ብክነት።",
      gainedSkills: "የሚቀስሙት ክህሎት",
      syllabus: "በተግባር የሚጭኑት ስርዓት",
      level: "የክህሎት ደረጃ",
      mode: "የስልጠናው ሁኔታ",
      register: "ይመዝገቡ እና ቦታ ይያዙ"
    },
    portfolio: {
      heading: "የተግባር ማስረጃዎች እና ታሪኮች",
      subheading: "በሲንታክስ ቴክኒሻኖች የተጠናቀቁ የተረጋገጡ የንግድ ጭነቶች፣ የስርዓት ዝርዝሮች እና ኦዲት የተደረጉ የአሠራር ውጤቶችን ያስሱ።",
      challenge: "የደንበኛው ፈተና",
      solution: "የሲንታክስ ቴክኖሎጂ መፍትሔ",
      implementation: "የስራ ዝርዝር እና በይነተገናኝ ካርታ",
      result: "የተገኙ ውጤቶች",
      installedHardware: "የተገጠመ ሃርድዌር",
      techInvolved: "የተጠቀሙባቸው ቴክኖሎጂዎች",
      auditedResults: "ኦዲት የተደረጉ ውጤቶች",
      similarChallenge: "ተመሳሳይ ፈተና አለብዎት?"
    },
    common: {
      back: "ወደ መግለጫው ይመለሱ",
      loading: "በማቀነባበር ላይ፣ እባክዎ ይጠብቁ...",
      search: "ዳታቤዝ ውስጥ ይፈልጉ...",
      clear: "ሁሉንም ማጣሪያዎች ያጽዱ",
      required: "ይህ ክፍል መሞላት አለበት",
      success: "ተግባሩ በተሳካ ሁኔታ ተጠናቋል!",
      error: "ያልተጠበቀ ስህተት ተከስቷል። እባክዎ እንደገና ይሞክሩ።",
      submit: "ጥያቄውን ይላኩ",
      cancel: "ይተው"
    },
    payment: {
      heading: "አስተማማኝ የጫፓ እና ቴሌብር ክፍያ ማእከል",
      methods: "የኢትዮጵያ ክፍያ አማራጮች",
      verify: "ክፍያ አረጋግጥ",
      status: "የክፍያ ሁኔታ",
      initiate: "አስተማማኝ ክፍያ ይጀምሩ",
      currencySymbol: "ብር ",
      currencyCode: "ETB"
    },
    form: {
      name: "ስምዎ",
      email: "የስራ ኢሜይል",
      organization: "ድርጅት / ኩባንያ",
      phone: "የስልክ ቁጥር",
      details: "የሚያስፈልጉ ዝርዝር ፍላጎቶች",
      urgency: "የፕሮጀክቱ አጣዳፊነት",
      budget: "የፕሮጀክቱ በጀት",
      validationRequired: "ይህ ክፍል መሞላት አለበት።",
      validationEmail: "እባክዎ ትክክለኛ የስራ ኢሜይል ያስገቡ።",
      validationPhone: "እባክዎ ትክክለኛ የስልክ ቁጥር ያስገቡ (+251...)።",
      successTitle: "ቅጹ በተሳካ ሁኔታ ተልኳል!",
      successDesc: "የውቅረት ጥያቄዎ ደርሶናል። የሜዳ መሐንዲስ በአጭር ጊዜ ውስጥ ይመረምረዋል።",
      errorTitle: "የመላክ ስህተት",
      errorDesc: "ማስገባት አልተቻለም። እባክዎ ግንኙነትዎን ያረጋግጡና እንደገና ይሞክሩ።"
    },
    empty: {
      noResults: "ምንም ተዛማጅ መፍትሔዎች ወይም ውቅሮች አልተገኙም።",
      noTickets: "ምንም ንቁ የሃርድዌር ምህንድስና ትኬቶች አልተገኙም።"
    },
    metadata: {
      title: "ሲንታክስ ቴክኖሎጂ",
      description: "በምስራቅ አፍሪካ አስተማማኝ የኮምፒውተር መረብ፣ የደህንነት መፍትሔዎች እና የቴክኒክ ስልጠና።"
    }
  },
  om: {
    nav: {
      solutions: "Furiwwan Daldalaa",
      training: "Akadaamii Leenjii",
      portfolio: "Qorannoo Haala",
      aiConsultant: "Gorsaa AI",
      tickets: "Hordoffii Tikkeettii"
    },
    hero: {
      badge: "Siraata ICT fi Meeshaalee Hardware Gaanfa Afriikaa Keessatti",
      title: "Teknoolojii Maamiltootaaf Ragaa Qabatamaa Qabu",
      subtitle: "Waggaa 8 oliif muxannoo qabatamaa pirojektoota nageenya baayomeetrikii, hidha keebila gigabit, fi hordoffii konkolaattotaa irratti dhiyeessine.",
      ctaConsultation: "Gorsa Gaafadhu",
      ctaQuote: "Gatii Gaafadhu",
      experience: "Muxannoo Waggaa 8+"
    },
    solutions: {
      heading: "Furiwwan Teknoolojii Daldalaa",
      subheading: "Hanqina daldalaa keessan addaan baasnee teknoolojiin furra. Ijaarsa amansiisoo hordoffii hojii ammayyaatiif.",
      problem: "Rakkoo Maamilaa",
      impact: "Dhibbaa Daldalaa",
      solution: "Furmaata Teknoolojii Syntax",
      benefits: "Faayidaa Ijaarsaa",
      approach: "Mala Hojiirra Oolmaa",
      whoFor: "Furmaanni Kun Sif Ta'aa",
      process: "Adeemsa Hojiirra Oolmaa",
      related: "Siriwwan Walfakkaatan",
      relevantProjects: "Pirojektoota Walfakkaatan",
      faq: "Gaaffilee Yeroo Baay'ee Gaafataman",
      specifications: "Fasala Teknikaa",
      requestQuote: "Gatii Gaafadhu",
      requestConsult: "Gorsa Gaafadhu"
    },
    training: {
      heading: "Akadaamii Leenjii Teknology",
      subheading: "Meeshaalee qabatamaa daldalaaf ta'an irratti leenjii qabatamaa argadhaa. Teeyorii qofa miti.",
      gainedSkills: "Dandeettii Argame",
      syllabus: "Wanta Hojiirra Oolchuuf Jirtan",
      level: "Sadarkaa Dandeettii",
      mode: "Adeemsa Leenjii",
      register: "Galmaa'i & Bakka Qabadhu"
    },
    portfolio: {
      heading: "Ragaalee Pirojektoota Hojiirra Oolanii",
      subheading: "Pirojektoota teeknishaanota keenyaan hojjetaman, qorannoo daldalaa fi bu'aawwan dhugaa argadhaa.",
      challenge: "Haala Maamilaa",
      solution: "Furmaata Teknoolojii Syntax",
      implementation: "Hojii Raawwatame fi Maappii",
      result: "Bu'aawwan Argaman",
      installedHardware: "Meeshaalee Dhaabaman",
      techInvolved: "Teknoolojiwwan Fayyadaman",
      auditedResults: "Bu'aa Odiitii",
      similarChallenge: "Rakkoo Walfakkaataa Qabduu?"
    },
    common: {
      back: "Gara Duubatti Deebi'i",
      loading: "Adeemsa keessa jira, maaloo eegaa...",
      search: "Barbaadi...",
      clear: "Maaltoo Haqi",
      required: "Bakki kun dirqama",
      success: "Hojichi milkiin raawwatameera!",
      error: "Dogoggorri hin eegamne uumameera. Maaloo irra deebi'ii yaali.",
      submit: "Eegumsa Ergi",
      cancel: "Dhiisi"
    },
    payment: {
      heading: "Kaffaltii Chapa fi Telebirr Amansiisaa",
      methods: "Filannoowwan Kaffaltii Itoophiyaa",
      verify: "Kaffaltii Mirkaneessi",
      status: "Haala Kaffaltii",
      initiate: "Kaffaltii Amansiisaa Jalqabi",
      currencySymbol: "ETB ",
      currencyCode: "ETB"
    },
    form: {
      name: "Maqaa Keessan",
      email: "Imeelii Hojii",
      organization: "Kumpaniyaa / Dhaabbata",
      phone: "Lakkoofsa Bilbilaa",
      details: "Wanta Isiniif Barbaachisu",
      urgency: "Yeroo Hojii",
      budget: "Baajata Pirojekti",
      validationRequired: "Bakki kun dirqama guutamuu qaba.",
      validationEmail: "Maaloo imeelii daldalaa sirrii ta'e galchaa.",
      validationPhone: "Maaloo lakkoofsa bilbilaa sirrii ta'e galchaa (+251...).",
      successTitle: "Unkaan Milkiin Ergameera!",
      successDesc: "Gaffiin ijaarama keessanii nu gaheera. Teeknishaanonni keenya dhiyoo keessatti ni hordofu.",
      errorTitle: "Dogoggora Erguu",
      errorDesc: "Erguun hin danda'amne. Maaloo interneetii keessan mirkaneessaa irra deebi'aa yaalaa."
    },
    empty: {
      noResults: "Furiwwan daldalaa walitti dhufeenya qaban hin argamne.",
      noTickets: "Tikkeettii daldalaa hojiirra jiru hin argamne."
    },
    metadata: {
      title: "Syntax Technology",
      description: "Siraata ICT, nageenya baayomeetrikii, fi leenjii teeknikaa Gaanfa Afriikaa keessatti."
    }
  },
  ti: {
    nav: {
      solutions: "ናይ ንግዲ ፍታሕ",
      training: "ናይ ስልጠና ኣካዳሚ",
      portfolio: "ጭቡጥ ምስክር",
      aiConsultant: "ናይ አይአይ ኣማኻሪ",
      tickets: "ክትትል ትኬት"
    },
    hero: {
      badge: "ኣብ ምብራቕ ኣፍሪቃ ዝበለጸ ናይ ኮምፒውተር መርበብን ድሕንነትን ፍታሕ",
      title: "ናይ ሓቂ ስራሕ ምስክር ዘለዎ ቴክኖሎጂ",
      subtitle: "ባዮሜትሪክ ናይ ድሕንነት መርበባት፣ ዝተወደቡ ናይ ጊጋቢት ኬብላትን ፍሊት ክትትልን ልዕሊ 8 ዓመት ዝተመስከረሉ ምህንድስና ልምድ ኣብ ኣፍሪቃ።",
      ctaConsultation: "ማዕዳ ሕተቱ",
      ctaQuote: "ዋጋ ሕተቱ",
      experience: "ልዕሊ 8+ ዓመት ናይ ስራሕ ልምዲ"
    },
    solutions: {
      heading: "ተክኒካዊ ናይ ንግዲ ፍታሕ",
      subheading: "ናይ ስራሕ ድሕረታት ተለልዮም ብምህንድስና ዝተፈትሑሉ። ንዘመናዊ ስራሕ ቦታታት ዝበለጸ እሙን ውቅራት።",
      problem: "ጸገም ዓማዊል",
      impact: "ኣብ ንግዲ ዘለዎ ጽልዋ",
      solution: "ፍታሕ ቴክኖሎጂ ሲንታክስ",
      benefits: "ቀንዲ ረብሓታት",
      approach: "ኣገባብ ትግበራ",
      whoFor: "እዚ ፍታሕ እዚ ንመን እዩ ተዳልዩ",
      process: "ቕደም-ሰዓብ ትግበራ",
      related: "ተዛመድቲ ስርዓታት",
      relevantProjects: "ተዛመድቲ ፕሮጀክታትን ጭቡጥ ማስረጃን",
      faq: "ተደጋጋሚ ዝሕተቱ ሕቶታት",
      specifications: "ተክኒካዊ ዝርዝራት",
      requestQuote: "ዋጋ ሕተቱ",
      requestConsult: "ማዕዳ ሕተቱ"
    },
    training: {
      heading: "ተክኒካዊ ስልጠና ኣካዳሚ",
      subheading: "ካብ ናይ ሓቂ ሃርድዌር በተግባር ዝተደገፈ ናይ ስራሕ ክእለት ቕሰሙ። ብዘይ ቲዎሪ ብኽነት።",
      gainedSkills: "ዝረኽብዎ ክእለት",
      syllabus: "በተግባር ዝጭበጥ ስርዓት",
      level: "ደረጃ ክእለት",
      mode: "ኩነታት ስልጠና",
      register: "ተመዝገቡ እሞ ቦታ ሓዙ"
    },
    portfolio: {
      heading: "ናይ ስራሕ ምስክር ታሪኽ",
      subheading: "ብናይ ሲንታክስ ቴክኒሻናት ዝተዛዘሙ ዝተመስከረሎም ናይ ንግዲ ጭነታት፣ ናይ ስርዓት ዝርዝራትን ኦዲት ዝተገብሩ ውጽኢታትን ዳህስሱ።",
      challenge: "ፈተና ዓማዊል",
      solution: "ፍታሕ ቴክኖሎጂ ሲንታክስ",
      implementation: "ዝርዝር ስራሕን ካርታን",
      result: "ዝተረኽቡ ውጽኢታት",
      installedHardware: "ዝተገጠመ ሃርድዌር",
      techInvolved: "ዝተጠቐምናሎም ቴክኖሎጂታት",
      auditedResults: "ኦዲት ዝተገብሩ ውጽኢታት",
      similarChallenge: "ተመሳሳሊ ፈተና ኣለኩም ዶ?"
    },
    common: {
      back: "ንድሕሪት ተመለሱ",
      loading: "ኣብ ምስራሕ እዩ ዘሎ፣ በጃኹም ተጸበዩ...",
      search: "ኣብ መረዳእታ ዳህስሱ...",
      clear: "ኹሉ ማጣረዪ ኣጽርዩ",
      required: "እዚ ቦታ እዚ ክምላእ ኣለዎ",
      success: "ተግባር ብዓወት ተፈጺሙ!",
      error: "ዘይተጸበናዮ ጌጋ ተፈጢሩ። በጃኹም ደጊምኩም ፈትኑ።",
      submit: "ሕቶኹም ስደዱ",
      cancel: "ይትረፍ"
    },
    payment: {
      heading: "እሙን ናይ ጫፓን ቴሌብርን ክፍሊት ማእከል",
      methods: "ናይ ኢትዮጵያ ክፍሊት ኣማራጺታት",
      verify: "ክፍሊት ኣረጋግጽ",
      status: "ኩነታት ክፍሊት",
      initiate: "እሙን ክፍሊት ጀምሩ",
      currencySymbol: "ብር ",
      currencyCode: "ETB"
    },
    form: {
      name: "ስምኩም",
      email: "ኢሜይል ስራሕ",
      organization: "ትካል / ኩባንያ",
      phone: "ቁጽሪ ቴሌፎን",
      details: "ዘድልዩ ዝርዝር ፍላጎታት",
      urgency: "ህጹጽነት ፕሮጀክት",
      budget: "በጀት ፕሮጀክት",
      validationRequired: "እዚ ቦታ እዚ ክምላእ ኣለዎ።",
      validationEmail: "በጃኹም ትክክለኛ ናይ ስራሕ ኢሜይል የእትዉ።",
      validationPhone: "በጃኹም ትክክለኛ ናይ ቴሌፎን ቁጽሪ የእትዉ (+251...)።",
      successTitle: "ቅጺ ብዓወት ተላኢኹ ኣሎ!",
      successDesc: "ናይ ምውቃር ሕቶኹም ደርሲና ኣሎ። ሓደ ናይ ስራሕ መሃንዲስ ብቕልጡፍ ክምርምሮ እዩ።",
      errorTitle: "ናይ ምስዳድ ጌጋ",
      errorDesc: "ምስዳድ አይተክአለን። በጃኹም ኢንተርኔትኩም ኣረጋጊጽኩም ደጊምኩም ፈትኑ።"
    },
    empty: {
      noResults: "ዝኾነ ተዛማዲ ፍታሕ ወይ ውቅር ኣይተረኽበን።",
      noTickets: "ዝኾነ ንቑሕ ናይ ሃርድዌር ትኬት ኣይተረኽበን።"
    },
    metadata: {
      title: "ሲንታክስ ቴክኖሎጂ",
      description: "ኣብ ምብራቕ ኣፍሪቃ ዝበለጸ ናይ ኮምፒውተር መርበብ፣ ናይ ደህንነት መፍትሔታትን ተክኒካዊ ስልጠናን።"
    }
  }
};

// Formats number to Ethiopia currency representation
export function formatCurrency(amount: number, lang: Language = "en"): string {
  const dict = DICTIONARIES[lang];
  const formattedAmount = amount.toLocaleString(lang === "en" ? "en-US" : "am-ET", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${dict.payment.currencySymbol}${formattedAmount}`;
}

// Format numbers in localized decimal layout
export function formatNumber(num: number, lang: Language = "en"): string {
  return num.toLocaleString(lang === "en" ? "en-US" : "am-ET");
}

// Format localized dates dynamically based on calendar preference
export function formatLocalizedDate(
  dateInput: Date | string,
  calendar: CalendarType = "gregorian",
  lang: Language = "en"
): string {
  const dateObj = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(dateObj.getTime())) return "";

  if (calendar === "ethiopian") {
    const eth = gregorianToEthiopian(dateObj);
    const monthsAm = [
      "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜን"
    ];
    const monthsOm = [
      "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tirr", "Yekatit", "Megabit", "Miyazia", "Ginbot", "Sene", "Hamle", "Nehasse", "Pagumen"
    ];
    const monthsTi = [
      "መስከረም", "ጥቅምቲ", "ሕዳር", "ታሕሳስ", "ጥሪ", "ለካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰነ", "ሓምለ", "ነሓሰ", "ጳጉሜን"
    ];
    const monthsEn = [
      "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tirr", "Yekatit", "Megabit", "Miyazia", "Ginbot", "Sene", "Hamle", "Nehasse", "Pagumen"
    ];

    let monthStr = monthsEn[eth.month - 1];
    if (lang === "am") monthStr = monthsAm[eth.month - 1];
    if (lang === "om") monthStr = monthsOm[eth.month - 1];
    if (lang === "ti") monthStr = monthsTi[eth.month - 1];

    return `${monthStr} ${eth.day}, ${eth.year} 🇪🇹`;
  } else {
    // Gregorian calendar display
    return dateObj.toLocaleDateString(lang === "en" ? "en-US" : "am-ET", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}
