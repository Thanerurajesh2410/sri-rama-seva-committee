export const v2Content = {
  te: {
    siteName: "శ్రీ రామాలయం ERP & భక్త పోర్టల్",
    tagline: "పామినివాండ్లవూరు • మంగళపల్లె పంచాయతీ",

    // 📜 10 Terms & Conditions
    termsAndConditions: [
      { id: 1, title: "1. విరాళాలు స్వచ్ఛందం (Donations are Voluntary)", desc: "ఆలయ నిర్మాణము మరియు పూజా కార్యక్రమాలకు సమర్పించే విరాళాలన్నీ భక్తులు తమ స్వచ్ఛంద విశ్వాసముతో మరియు ఇష్టపూర్వకముగా అందించేవై ఉండాలి." },
      { id: 2, title: "2. నిధుల వినియోగం (Utilization of Funds)", desc: "సేకరించిన అన్ని నిధులు కేవలం ఆలయ నిర్మాణం, అభివృద్ధి, నిర్వహణ, ధార్మిక పూజలు మరియు ట్రస్ట్/కమిటీ ఆమోదించిన ఇతర సేవా కార్యక్రమాలకు మాత్రమే వినియోగించబడతాయి." },
      { id: 3, title: "3. అధికారిక రశీదు (Official Receipt)", desc: "సమర్పించిన ప్రతి విరాళానికి శ్రీ రామాలయం పామినివాండ్లవూరు కమిటీ ద్వారా అధికారిక డిజిటల్/ప్రింటెడ్ రశీదు జారీ చేయబడుతుంది." },
      { id: 4, title: "4. వాపసు నొసగబడదు (Non-refundable)", desc: "ఒక్కసారి విరాళం అందించిన తరువాత, ఆ మొత్తం వాపసు (Non-refundable) ఇవ్వబడదు మరియు ఇతరులకు బదిలీ (Non-transferable) చేయబడదు." },
      { id: 5, title: "5. సామగ్రి విరాళాలు (In-kind Donations)", desc: "సిమెంట్, స్టీల్, ఇటుకలు, ఇసుక, విద్యుత్ సామాగ్రి లేదా ఇతర నిర్మాణ సామగ్రి రూపంలో ఇచ్చే కానుకలు ప్రత్యేక సామగ్రి రిజిస్టర్‌లో నమోదు చేయబడతాయి." },
      { id: 6, title: "6. పారదర్శకత (Transparency)", desc: "ట్రస్ట్/కమిటీ అన్ని విరాళాలు మరియు వ్యయాలకు సంబంధించి సరైన రికార్డులను నిర్వహిస్తుంది. భక్తులు మరియు గ్రామీణుల అభ్యర్థన మేరకు ఆర్థిక వివరాలు పంచుకోబడతాయి." },
      { id: 7, title: "7. బ్యాంక్ & ఆన్‌లైన్ బదిలీలు (Bank & Online Transfers)", desc: "ఆన్‌లైన్ విరాళం ఇచ్చే ముందు దయచేసి అధికారిక బ్యాంక్ ఖాతా లేదా UPI QR కోడ్‌ను సరిచూసుకోండి. అనధికారిక ఖాతాలకు పంపే నిధులకు కమిటీ బాధ్యత వహించదు." },
      { id: 8, title: "8. రశీదు భద్రపరచుట (Receipt Verification)", desc: "భవిష్యత్తు సంప్రదింపులు మరియు ధృవీకరణ కొరకు దయచేసి మీ విరాళాల రశీదు నంబర్‌ను భద్రపరుచుకోవలెను." },
      { id: 9, title: "9. ఆలయ నిధి నిర్వహణ (Temple Fund Governance)", desc: "భక్తుల కానుకలు మరియు విరాళాలు ఆలయ నియమావళి మరియు కమిటీ నిర్వహణ నిబంధనలకు అనుగుణంగా నిర్వహించబడతాయి." },
      { id: 10, title: "10. కమిటీ నిర్ణయమే అంతిమం (Committee Decision)", desc: "విరాళాలు లేదా సేవల విషయమై ఏవైనా అభిప్రాయ భేదాలు తలెత్తితే, ఆలయ సేవా కమిటీ యొక్క నిర్ణయమే అంతిమమైనది." }
    ],

    // 🏆 10 Major Donation Categories & Sub-types Classification
    donationCategories: [
      {
        id: "general",
        name: "1. సాధారణ విరాళాలు (General Donation)",
        desc: "ఆలయ నిత్య నిర్వహణ & సాధారణ నిధి",
        subTypes: ["హుండీ విరాళం (Hundi Donation)", "నగదు కానుక (Cash Donation)", "ఆన్‌లైన్ ఈ-హుండి (Online Donation)", "సాధారణ గ్రామాభివృద్ధి నిధి (General Temple Development)"]
      },
      {
        id: "construction",
        name: "2. రాతి గోడల నిర్మాణ విరాళాలు (Temple Construction Donations)",
        desc: "శ్రీ రామాలయ రాతి గోడలు, గర్భగుడి & ప్రాకార నిర్మాణం",
        subTypes: [
          "గర్భగుడి పునాది సేవ (Foundation Work)",
          "రాతి స్తంభాల నిర్మాణం (Pillars & Structure)",
          "శిఖరం & కప్పు నిర్మాణం (Roof & Slab)",
          "గ్రానైట్ ఫ్లోరింగ్ (Flooring)",
          "విద్యుత్ అమరికలు (Electrical Work)",
          "ప్లంబింగ్ & డ్రైనేజీ (Plumbing)",
          "రంగులు & అలంకరణ (Painting)",
          "కాంపౌండ్ వాల్ (Compound Wall)",
          "రాజ గోపురం (Main Gopuram)",
          "గర్భగుడి ద్వారబంధాలు (Sanctum Garbha Gudi)",
          "ఆలయ ఫర్నిచర్ (Temple Furniture)",
          "ఇత్తడి & కాంస్య గంటలు (Temple Bells)"
        ]
      },
      {
        id: "rituals",
        name: "3. ధార్మిక & పూజా సేవలు (Religious & Ritual Donations)",
        desc: "నిత్య పూజలు, అభిషేకాలు & మహోత్సవాలు",
        subTypes: [
          "నిత్య పూజ (Daily Pooja)",
          "అష్టోత్తర అర్చన (Archana)",
          "పంచామృత అభిషేకం (Abhishekam)",
          "అన్నదాన సేవ (Annadanam)",
          "నిత్య దీపారాధన (Deepam Oil/Ghee)",
          "ఉత్సవ ప్రాయోజకత్వం (Festival Sponsorship)",
          "ప్రసాద పంపిణీ సేవ (Prasadam Seva)",
          "సుగంధ పుష్ప సేవ (Flower Seva)",
          "స్వామివారి పట్టు వస్త్రాలు (Vastram Clothing)",
          "విశేష అలంకార సేవ (Alankaram)"
        ]
      },
      {
        id: "assets",
        name: "4. శాశ్వత ఆస్తి & పరికరాల కానుకలు (Asset Donations)",
        desc: "ఆలయ పరికరాలు & విద్యుత్ ఉపకరణాలు",
        subTypes: ["ఇటుకలు (Bricks)", "సిమెంట్ (Cement)", "స్టీల్ (Steel)", "ఇసుక (Sand)", "గ్రానైట్ (Granite)", "టేకు కలప (Wood)", "విద్యుత్ సామాగ్రి (Electrical Materials)", "వాటర్ ట్యాంక్ (Water Tank)", "ఫ్యాన్లు (Fans)", "లైట్లు (Lights)", "జనరేటర్ (Generator)", "CCTV కెమెరాలు (CCTV)", "సౌండ్ సిస్టమ్ & మైకులు (Sound System)"]
      },
      {
        id: "memorial",
        name: "5. స్మారక & పండుగ కానుకలు (Memorial & Occasion Donations)",
        desc: "జ్ఞాపకార్థం, పుట్టినరోజులు & వివాహ వార్షికోత్సవాలు",
        subTypes: ["పెద్దల జ్ఞాపకార్థం (In Memory of...)", "జన్మదిన కానుక (Birthday Donation)", "వివాహ వార్షికోత్సవం (Wedding Anniversary Donation)", "గృహప్రవేశ సేవ (House Warming)", "నూతన వ్యాపార ప్రారంభం (New Business)", "కృతజ్ఞతా పూర్వక సేవ (Thanksgiving Donation)"]
      },
      {
        id: "sponsorships",
        name: "6. ప్రత్యేక ఆలయ ప్రాయోజకాలు (Special Sponsorships)",
        desc: "ద్వారబంధాలు, స్తంభాలు & వాహనాల దాతత్వ సేవలు",
        subTypes: ["ఆలయ రాతి స్తంభం ప్రాయోజకత్వం (Temple Pillar Sponsorship)", "రాతి ద్వారబంధం (Door Sponsorship)", "కిటికీల అమరిక (Window Sponsorship)", "ధ్వజస్తంభ స్థాపన (Dhwaja Stambham)", "నంది / హనుమద్మంటపం (Nandi/Hanuma Mantapam)", "దివ్య రథం (Temple Chariot)", "నవగ్రహ మండపం (Navagraha Shrine)", "ముఖ్య ప్రవేశ ద్వారం (Compound Gate)"]
      },
      {
        id: "membership",
        name: "7. సభ్యత్వ చందాలు (Membership Contributions)",
        desc: "కమిటీ సభ్యత్వం & ధార్మిక సేవ చందాలు",
        subTypes: ["శాశ్వత జీవితకాల సభ్యత్వం (Lifetime Member)", "వార్షిక చందా (Annual Member)", "వాలంటీర్ సేవా కానుక (Volunteer Contribution)"]
      },
      {
        id: "corpus",
        name: "8. శాశ్వత కార్పస్ నిధి (Corpus Fund)",
        desc: "ఆలయ శాశ్వత డిపాజిట్ & అత్యవసర నిధి",
        subTypes: ["శాశ్వత కార్పస్ నిధి (Permanent Fund)", "ఫిక్స్‌డ్ డిపాజిట్ నిధి (Fixed Deposit Fund)", "అత్యవసర నిధి (Emergency Fund)", "ఆలయ సంరక్షణ నిధి (Maintenance Fund)"]
      },
      {
        id: "modes",
        name: "9. చెల్లింపు మార్గాలు (Accounting Payment Modes)",
        desc: "నగదు, ఆన్‌లైన్ & బ్యాంక్ బదిలీలు",
        subTypes: ["నగదు (Cash)", "యాక్సిస్ / ఎస్‌బిఐ బ్యాంక్ బదిలీ (Bank Transfer)", "యూపీఐ / ఫోన్‌పే QR (UPI)", "చెక్కు (Cheque)", "డిమాండ్ డ్రాఫ్ట్ (Demand Draft)", "సామగ్రి కానుక (In-kind Donation)"]
      },
      {
        id: "inkind",
        name: "10. సామగ్రి విరాళాల కేటలాగ్ (In-kind Donations Catalog)",
        desc: "నిర్మాణ సామాగ్రి, భోజన వస్తువులు & శ్రమదానం",
        subTypes: ["సిమెంట్ బస్తాలు (Cement Bags)", "ఇటుకలు (Bricks)", "స్టీల్ రాడ్లు (Steel)", "టైల్స్ & గ్రానైట్ (Tiles)", "ఇసుక & కంకర (Sand)", "శ్రమదానం / కూలీల వేతనం (Labour)", "నిత్యాన్నదాన సరుకులు (Food Items)", "నిర్మాణ యంత్రాల వాడకం (Construction Equipment)", "మొక్కలు & పూల తోట (Plants & Trees)", "విద్యుత్ తీగలు & లైట్లు (Electrical Items)"]
      }
    ],

    construction: {
      totalBudget: "₹ 50,00,000",
      budgetNum: 5000000,
      fundsReceived: "₹ 18,50,000",
      receivedNum: 1850000,
      fundsUtilized: "₹ 12,40,000",
      utilizedNum: 1240000,
      cashInHand: "₹ 1,10,000",
      bankBalance: "₹ 5,00,000",
      progressPct: 75,
      milestones: [
        { date: "12-05-2026", title: "భూమి పూజ & శంకుస్థాపన", status: "Completed" },
        { date: "24-06-2026", title: "గర్భగుడి పునాది నిర్మాణ సేవ", status: "Completed" },
        { date: "15-07-2026", title: "రాతి గోడలు & ద్వారబంధాల అమరిక", status: "In Progress (75%)" },
        { date: "30-08-2026", title: "శిఖర గోపురం & కలశ స్థాపన", status: "Upcoming" },
        { date: "15-10-2026", title: "మహా కుంభాభిషేకం & ప్రతిష్ఠాపన", status: "Upcoming" }
      ]
    },
    sevas: [
      { id: "archana", name: "శ్రీ రామ అష్టోత్తర శతనామావళి అర్చన", amount: "₹ 108", time: "ఉదయం 07:00 - 08:30" },
      { id: "abhishekam", name: "నిత్య పంచామృత అభిషేకం", amount: "₹ 501", time: "ఉదయం 06:00 - 07:30" },
      { id: "deepa", name: "పవిత్ర దీపారాధన & అలంకార సేవ", amount: "₹ 1,008", time: "సాయంత్రం 06:30" },
      { id: "vastram", name: "స్వామివారి పట్టు వస్త్రముల సేవ", amount: "₹ 2,500", time: "రోజూ" },
      { id: "alankaram", name: "శ్రీ సీతారామ కల్యాణోత్సవం & ఊంజల్ సేవ", amount: "₹ 5,008", time: "విశేష దినాలు" }
    ],
    events: [
      { id: 1, title: "శ్రీరామనవమి బ్రహ్మోత్సవాలు 2027", date: "15-04-2027", desc: "గ్రామ వీధులలో శ్రీ సీతారాముల దివ్య రథోత్సవం మరియు రాత్రి దివ్య కల్యాణోత్సవం." },
      { id: 2, title: "హనుమజ్జయంతి మహోత్సవం", date: "28-05-2027", desc: "శ్రీ హనుమాన్ చాలీసా పారాయణం, సిందూర పూజ మరియు భక్తులకు విశేష అన్నదానం." }
    ],
    news: [
      { id: 1, title: "ఆలయ రాతి గోడల నిర్మాణం 75% పూర్తి", date: "24-07-2026", snippet: "భక్తుల పవిత్ర సహకారంతో శ్రీ రామాలయ ద్వారబంధాలు మరియు చెక్కిన రాతి గోడల పనులు శరవేగంగా జరుగుతున్నాయి." },
      { id: 2, title: "ఈ-హుండి మరియు ఆన్‌లైన్ రశీదుల జారీ ప్రారంభం", date: "18-07-2026", snippet: "శ్రీ రామా సేవా కమిటీ ఆధ్వర్యంలో డిజిటల్ ఈ-హుండి మరియు వాట్సాప్ రశీదుల సదుపాయం అందుబాటులోకి వచ్చింది." }
    ],
    materials: [
      { type: "రాతి రాళ్ళు (Carved Granite Stones)", total: "50 లోడ్లు", donated: "38 లోడ్లు" },
      { type: "సిమెంట్ బస్తాలు (Cement Bags)", total: "1500 బస్తాలు", donated: "1120 బస్తాలు" },
      { type: "స్టీల్ & ఇనుము (Steel Rods)", total: "15 టన్నులు", donated: "11 టన్నులు" },
      { type: "ద్వారబంధాలు & కలప (Teak Wood Frames)", total: "8 జతలు", donated: "6 జతలు" }
    ],
    financials: {
      monthlyIncome: [
        { month: "మే 2026", income: 450000, expense: 210000 },
        { month: "జూన్ 2026", income: 680000, expense: 430000 },
        { month: "జులై 2026", income: 720000, expense: 600000 }
      ],
      expenses: [
        { category: "చెక్కిన రాతి రాళ్ళ కొనుగోలు", amount: "₹ 6,50,000" },
        { category: "మేస్త్రీలు & కార్మికుల వేతనాలు", amount: "₹ 3,20,000" },
        { category: "సిమెంట్ & స్టీల్ సామాగ్రి", amount: "₹ 1,80,000" },
        { category: "అన్నదానం & నిత్య పూజల ఖర్చులు", amount: "₹ 90,000" }
      ]
    }
  },
  en: {
    siteName: "Sri Ramalayam ERP & Devotee Portal",
    tagline: "Paminivandla Vooru • Mangalapalli Panchayat",
    termsAndConditions: [
      { id: 1, title: "1. Donations are voluntary", desc: "All donations are voluntary and made by devotees according to their faith and willingness." },
      { id: 2, title: "2. Utilization of funds", desc: "All donated funds will be used only for temple construction, development, maintenance, religious activities, and other charitable purposes approved by the Trust/Committee." },
      { id: 3, title: "3. Receipt", desc: "Every donation will be acknowledged with an official receipt issued by Sri Ramalayam Paminivandlavooru." },
      { id: 4, title: "4. Non-refundable", desc: "Once a donation is made, it is non-refundable and non-transferable." },
      { id: 5, title: "5. In-kind donations", desc: "Material donations such as cement, steel, bricks, sand, electrical items, or other construction materials will be recorded separately." },
      { id: 6, title: "6. Transparency", desc: "The Trust/Committee will maintain proper records of donations and expenditures, and financial details may be shared with devotees whenever appropriate." },
      { id: 7, title: "7. Bank & Online Transfers", desc: "Kindly verify the official bank account or QR code before making any online donation. The committee is not responsible for donations made to unauthorized accounts." },
      { id: 8, title: "8. Receipt verification", desc: "Please preserve your donation receipt for future reference and verification." },
      { id: 9, title: "9. Temple Fund Governance", desc: "All contributions and donations are managed in strict compliance with temple guidelines and committee regulations." },
      { id: 10, title: "10. Committee decision", desc: "In case of any dispute regarding donations, the decision of the Temple Committee shall be final." }
    ],
    donationCategories: [
      { id: "general", name: "1. General Donation", desc: "General Temple Development & Maintenance", subTypes: ["Hundi Donation", "Cash Donation", "Online Donation", "General Temple Development"] },
      { id: "construction", name: "2. Temple Construction Donations", desc: "Sanctum & Stone Walls Construction", subTypes: ["Foundation Work", "Pillars & Structure", "Roof & Slab", "Flooring", "Electrical Work", "Plumbing", "Painting", "Compound Wall", "Main Gopuram", "Sanctum (Garbha Gudi)", "Temple Furniture", "Temple Bells"] },
      { id: "rituals", name: "3. Religious & Ritual Donations", desc: "Daily Pooja, Abhishekam & Festivals", subTypes: ["Daily Pooja", "Archana", "Abhishekam", "Annadanam", "Deepam (Oil/Ghee)", "Festival Sponsorship", "Prasadam Seva", "Flower Seva", "Vastram (Clothing)", "Alankaram"] },
      { id: "assets", name: "4. Asset Donations", desc: "Structural Assets & Electrical Equipment", subTypes: ["Bricks", "Cement", "Steel", "Sand", "Granite", "Wood", "Electrical Materials", "Water Tank", "Fans", "Lights", "Generator", "CCTV", "Sound System"] },
      { id: "memorial", name: "5. Memorial & Occasion Donations", desc: "In Memory, Birthdays & Anniversaries", subTypes: ["In Memory of...", "Birthday Donation", "Wedding Anniversary Donation", "House Warming", "New Business", "Thanksgiving Donation"] },
      { id: "sponsorships", name: "6. Special Sponsorships", desc: "Pillars, Doors & Chariots Sponsorship", subTypes: ["Temple Pillar Sponsorship", "Door Sponsorship", "Window Sponsorship", "Dhwaja Stambham", "Nandi Mantapam", "Temple Chariot", "Navagraha Shrine", "Compound Gate"] },
      { id: "membership", name: "7. Membership Contributions", desc: "Lifetime & Volunteer Memberships", subTypes: ["Lifetime Member", "Annual Member", "Volunteer Contribution"] },
      { id: "corpus", name: "8. Corpus Fund", desc: "Permanent Endowment & Emergency Fund", subTypes: ["Permanent Fund", "Fixed Deposit Fund", "Emergency Fund", "Maintenance Fund"] },
      { id: "modes", name: "9. Donation Payment Modes", desc: "Cash, Bank, UPI & Cheque", subTypes: ["Cash", "Bank Transfer", "UPI", "Cheque", "Demand Draft", "In-kind Donation"] },
      { id: "inkind", name: "10. In-kind Donations Catalog", desc: "Construction Items & Food Items", subTypes: ["Cement Bags", "Bricks", "Steel", "Tiles", "Sand", "Labour", "Food Items", "Construction Equipment", "Plants & Trees", "Electrical Items"] }
    ],
    construction: {
      totalBudget: "₹ 50,00,000",
      budgetNum: 5000000,
      fundsReceived: "₹ 18,50,000",
      receivedNum: 1850000,
      fundsUtilized: "₹ 12,40,000",
      utilizedNum: 1240000,
      cashInHand: "₹ 1,10,000",
      bankBalance: "₹ 5,00,000",
      progressPct: 75,
      milestones: [
        { date: "12-05-2026", title: "Bhoomi Pooja & Foundation Stone", status: "Completed" },
        { date: "24-06-2026", title: "Sanctum Sanctorum Stone Base", status: "Completed" },
        { date: "15-07-2026", title: "Carved Stone Walls & Frames Setup", status: "In Progress (75%)" },
        { date: "30-08-2026", title: "Shikhara Gopuram & Kalasam Setup", status: "Upcoming" },
        { date: "15-10-2026", title: "Maha Kumbhabhishekam & Consecration", status: "Upcoming" }
      ]
    },
    sevas: [
      { id: "archana", name: "Sri Rama Ashtottara Archana", amount: "₹ 108", time: "07:00 AM - 08:30 AM" },
      { id: "abhishekam", name: "Panchamrutha Abhishekam", amount: "₹ 501", time: "06:00 AM - 07:30 AM" },
      { id: "deepa", name: "Sacred Lamp & Deepalankara Seva", amount: "₹ 1,008", time: "06:30 PM" },
      { id: "vastram", name: "Silk Vastram Sponsorship", amount: "₹ 2,500", time: "Daily" },
      { id: "alankaram", name: "Sita Rama Kalyanotsavam & Unjal Seva", amount: "₹ 5,008", time: "Festival Days" }
    ],
    events: [
      { id: 1, title: "Sri Ramanavami Brahmotsavam 2027", date: "15-04-2027", desc: "Grand Rathotsavam procession through village streets followed by Divine Kalyanotsavam." },
      { id: 2, title: "Hanuman Jayanthi Mahotsavam", date: "28-05-2027", desc: "Hanuman Chalisa Chanting, Sindoora Pooja, and Grand Annadanam for all devotees." }
    ],
    news: [
      { id: 1, title: "75% Stone Walls Construction Completed", date: "24-07-2026", snippet: "Temple carved stone pillars and sanctum door frames installation progressing at rapid pace." },
      { id: 2, title: "Digital E-Hundi & Online Receipts System Launched", date: "18-07-2026", snippet: "Sri Rama Seva Committee activates WhatsApp instant receipt generator and digital E-Hundi." }
    ],
    materials: [
      { type: "Carved Granite Stones", total: "50 Loads", donated: "38 Loads" },
      { type: "Cement Bags", total: "1500 Bags", donated: "1120 Bags" },
      { type: "Steel Rods", total: "15 Tons", donated: "11 Tons" },
      { type: "Teak Wood Door Frames", total: "8 Sets", donated: "6 Sets" }
    ],
    financials: {
      monthlyIncome: [
        { month: "May 2026", income: 450000, expense: 210000 },
        { month: "June 2026", income: 680000, expense: 430000 },
        { month: "July 2026", income: 720000, expense: 600000 }
      ],
      expenses: [
        { category: "Carved Granite Stones Purchase", amount: "₹ 6,50,000" },
        { category: "Masons & Worker Wages", amount: "₹ 3,20,000" },
        { category: "Cement & Steel Materials", amount: "₹ 1,80,000" },
        { category: "Annadanam & Pooja Expenses", amount: "₹ 90,000" }
      ]
    }
  }
};
