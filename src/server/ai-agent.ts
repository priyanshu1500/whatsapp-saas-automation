import { AIResponsePayload, BusinessConfig, Message, PropertyListing } from '@/types';

export class WhatsAppRealEstateAgent {
  async processMessage(
    incomingText: string,
    history: Message[],
    config: BusinessConfig
  ): Promise<AIResponsePayload> {
    const text = incomingText.trim();
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        return await this.callGemini(text, history, config, geminiKey);
      } catch (err) {
        console.warn('[AI] Gemini call failed, falling back to local engine:', err);
      }
    } else if (openaiKey) {
      try {
        return await this.callOpenAI(text, history, config, openaiKey);
      } catch (err) {
        console.warn('[AI] OpenAI call failed, falling back to local engine:', err);
      }
    }

    return this.processLocally(text, history, config);
  }

  /**
   * Local High-Ticket Real Estate NLP Engine with Meta 2026 Policy Compliance
   * Supports seamless real-time English, Hinglish, and Hindi conversational understanding
   */
  private processLocally(
    text: string,
    history: Message[],
    config: BusinessConfig
  ): AIResponsePayload {
    const raw = text.trim();
    // Normalize typos and common Hinglish phrasing
    let normalized = raw.toLowerCase()
      .replace(/\bfamilt\b/g, 'family')
      .replace(/\bfamly\b/g, 'family')
      .replace(/\bfamiliy\b/g, 'family')
      .replace(/\bkyarahgea\b/g, 'kya rahega')
      .replace(/\bkyarahega\b/g, 'kya rahega')
      .replace(/\bkyahoga\b/g, 'kya hoga')
      .replace(/\blie\b/g, 'liye')
      .replace(/\boptins\b/g, 'options')
      .replace(/\boptons\b/g, 'options')
      .replace(/\bbudgt\b/g, 'budget')
      .replace(/\bchiye\b|\bchaie\b/g, 'chahiye')
      .replace(/\brecomnd\b|\brecomend\b|\brecomended\b|\bsugest\b/g, 'recommend');

    const lower = normalized;
    const properties = config.properties || [];

    // Language Detection: Detect Hinglish / Hindi
    const hindiRegex = /[\u0900-\u097F]/;
    const isHindiScript = hindiRegex.test(raw);
    const hinglishTokens = [
      'ghar', 'makan', 'flat', 'dikhao', 'dikhado', 'dikha', 'batao', 'bataiye',
      'dekhna', 'dekhni', 'dekhne', 'kya', 'kitna', 'kitne', 'kaunsa', 'hoga',
      'hai', 'hain', 'chahiye', 'chalega', 'bhejo', 'bhej do', 'bhejiye', 'aana',
      'gaadi', 'baje', 'kal', 'sham', 'subah', 'par', 'me', 'se', 'kripya',
      'namaste', 'shukriya', 'kothi', 'naksha', 'rate', 'daam', 'paisa',
      'rahega', 'liye', 'bache', 'bacche', 'parivar',
    ];
    const isHinglish =
      !isHindiScript && hinglishTokens.some((tok) => lower.split(/\s+/).includes(tok) || lower.includes(tok));

    // 1. Off-topic check (Meta Jan 15 2026 Policy)
    const offtopicKeywords = [
      'poem', 'shayari', 'song', 'joke', 'movie', 'cricket', 'python', 'javascript',
      'weather', 'recipe', 'biryani', 'politics', 'modi', 'trump', 'who is',
      'kavita', 'chutkula', 'kahani', 'gana', 'film',
    ];
    if (
      config.guardrail_refuse_offtopic &&
      offtopicKeywords.some((kw) => lower.includes(kw)) &&
      !lower.includes('skyline') &&
      !lower.includes('property') &&
      !lower.includes('flat') &&
      !lower.includes('bhk') &&
      !lower.includes('villa') &&
      !lower.includes('ghar') &&
      !lower.includes('makan') &&
      !lower.includes('penthouse')
    ) {
      if (isHindiScript) {
        return {
          reply: `नमस्ते! मैं ${config.name} का स्वचालित रियल एस्टेट सलाहकार हूँ। मेटा की 2026 नीति के अनुसार, मैं केवल प्रॉपर्टी विवरण, फ्लोर प्लान, RERA मूल्य और प्राइवेट साइट विज़िट में सहायता कर सकता हूँ। बताएं, आपकी प्रॉपर्टी खोज में मैं क्या मदद करूँ?`,
          intent: 'refusal',
          reasoning: 'Off-topic Hindi query caught by Meta 2026 task-focused guardrail.',
          refused_reason: 'Meta 2026 General-Chatbot Policy Compliance',
        };
      }
      if (isHinglish) {
        return {
          reply: `Namaste! Main ${config.name} ka official AI luxury property consultant hoon. Meta ki 2026 policy ke anusaar, main keval property details, floor plans, RERA pricing aur VIP site visits arrange karne me assist kar sakta hoon. Aapko hamare luxury residences ke baare me kya janna hai?`,
          intent: 'refusal',
          reasoning: 'Off-topic Hinglish query caught by Meta 2026 task-focused guardrail.',
          refused_reason: 'Meta 2026 General-Chatbot Policy Compliance',
        };
      }
      return {
        reply: `Namaste! I am the automated WhatsApp property advisor for ${config.name}. To ensure the highest standard of service and comply with Meta's messaging policies, I can only assist with property details, floor plans, pricing in ₹ Crores, and scheduling private VIP site visits. How may I assist your real estate journey today?`,
        intent: 'refusal',
        reasoning: 'Off-topic query caught by Meta 2026 task-focused guardrail.',
        refused_reason: 'Meta 2026 General-Chatbot Policy Compliance',
      };
    }

    // 2. Bot Transparency Disclosure ("Are you a bot?")
    const botQueryKeywords = [
      'are you a bot', 'are you ai', 'kya tum bot ho', 'kya tum ai ho', 'kya tum robot ho',
      'human or bot', 'insan ho ya computer', 'kya aap bot hain', 'aap ai ho kya',
    ];
    if (
      config.guardrail_honest_bot &&
      botQueryKeywords.some((kw) => lower.includes(kw))
    ) {
      if (isHinglish || isHindiScript) {
        return {
          reply: `Ji haan! Main ${config.name} ka official AI Luxury Property Consultant hoon. Main 24/7 available hoon taaki aapko instant RERA details, floor plans aur private chauffeur site visit schedule kar saku. Agar aap Managing Director Mr. Raghav Singhal se direct baat karna chahte hain, toh bas "director" ya "call" likh kar bhejein!`,
          intent: 'question',
          reasoning: 'Honest AI bot disclosure provided in Hinglish.',
        };
      }
      return {
        reply: `Yes, I am the official AI Luxury Property Consultant for ${config.name}. I am available 24/7 to provide instant RERA details, floor plans, and schedule private chauffeur site visits. If you would like to speak directly with Managing Director Raghav Singhal, just reply "director" or "human"!`,
        intent: 'question',
        reasoning: 'Honest AI bot disclosure provided.',
      };
    }

    // 3. Human Sales Director / Broker Handover Request
    const humanKeywords = [
      'talk to human', 'director', 'broker', 'call me', 'raghav', 'sales team',
      'subvention', 'loan', 'counter offer', 'negotiate', 'custom payment',
      'discount', 'baat karni', 'baat karao', 'phone karo', 'call karo', 'insan se',
    ];
    if (humanKeywords.some((kw) => lower.includes(kw))) {
      if (isHinglish || isHindiScript) {
        return {
          reply: `Bilkul samajh gaya. Maine aapki request hamare Managing Director Mr. Raghav Singhal ji ko priority handover me mark kar di hai. Wo aapse direct is number par sampark karenge taaki bespoke payment terms aur customized structures discuss kar sakein.`,
          intent: 'human',
          reasoning: 'Buyer requested human broker intervention or bespoke commercial discussion in Hinglish.',
        };
      }
      return {
        reply: `Understood. I have flagged your request with priority to our Managing Director, Mr. Raghav Singhal. He will contact you directly on this number shortly to discuss bespoke terms and commercial structures.`,
        intent: 'human',
        reasoning: 'Buyer requested human broker intervention or bespoke commercial discussion.',
      };
    }

    // 4. Digital Brochure / Floor Plan Download Intent
    const brochureKeywords = [
      'brochure', 'floor plan', 'layout', 'master plan', 'dossier', 'pdf',
      'lookbook', 'deck', 'naksha', 'map', 'photos', 'bhejo', 'download',
    ];
    if (brochureKeywords.some((kw) => lower.includes(kw)) && (lower.includes('brochure') || lower.includes('floor') || lower.includes('plan') || lower.includes('layout') || lower.includes('naksha') || lower.includes('pdf') || lower.includes('lookbook'))) {
      if (isHinglish || isHindiScript) {
        return {
          reply: `Zaroor! Aap ${config.name} ka confidential architectural lookbook aur master floor plans yahan se download kar sakte hain:\n🔗 https://skyline-estates.com/dossier.pdf\n(RERA Registration: ${config.rera_registration || 'HARERA-GGM-2024-9182'})\n\nKya aap sample flat ka accompanied luxury walkthrough is weekend schedule karna chahenge?`,
          intent: 'brochure',
          service: 'Digital Brochure & Lookbook Dossier',
          reasoning: 'Buyer requested floor plans and brochure in Hinglish.',
        };
      }
      return {
        reply: `Certainly! You can download the confidential architectural lookbook & master floor plans for ${config.name} at: https://skyline-estates.com/dossier.pdf (RERA ID: ${config.rera_registration || 'HARERA-GGM-2024-9182'}). Would you like to schedule an accompanied sample sky villa walkthrough this week?`,
        intent: 'brochure',
        service: 'Digital Brochure & Lookbook Dossier',
        reasoning: 'Buyer requested floor plans and brochure.',
      };
    }

    // Match property from catalog
    let matchedProp: PropertyListing | undefined;
    if (lower.includes('grand') || lower.includes('horizon') || lower.includes('penthouse') || lower.includes('sky villa') || lower.includes('5 bhk')) {
      matchedProp = properties.find((p) => p.slug.includes('grand-horizon')) || properties[0];
    } else if (lower.includes('lumina') || lower.includes('3 bhk') || lower.includes('4 bhk') || lower.includes('sector 54')) {
      matchedProp = properties.find((p) => p.slug.includes('lumina')) || properties[1];
    } else if (lower.includes('crestview') || lower.includes('golf') || lower.includes('villa') || lower.includes('kothi') || lower.includes('independent')) {
      matchedProp = properties.find((p) => p.slug.includes('crestview')) || properties[2];
    } else if (lower.includes('commercial') || lower.includes('office') || lower.includes('retail') || lower.includes('rental yield') || lower.includes('cyber')) {
      matchedProp = properties.find((p) => p.slug.includes('commercial')) || properties[3];
    }

    // =========================================================================
    // 5. CONSULTATIVE RECOMMENDATION & ADVISORY ENGINE
    // Tailored guidance based on family size, lifestyle, budget, & investment
    // =========================================================================
    const isRecommendationQuery =
      lower.includes('best') ||
      lower.includes('recommend') ||
      lower.includes('suggest') ||
      lower.includes('sahi rahega') ||
      lower.includes('kaunsa lu') ||
      lower.includes('kaunsa sahi') ||
      lower.includes('kaunsa better') ||
      lower.includes('kya lu') ||
      lower.includes('suitable') ||
      lower.includes('perfect') ||
      lower.includes('ideal') ||
      lower.includes('advis') ||
      lower.includes('batao') ||
      lower.includes('options');

    const isFamilyQuery =
      lower.includes('family') ||
      lower.includes('parivar') ||
      lower.includes('member') ||
      lower.includes('bachhe') ||
      lower.includes('kids') ||
      lower.includes('parents') ||
      lower.includes('couple');

    // Scenario A: Family of 4 (or 3-4 members / kids)
    const isFamilyOf4 =
      (isFamilyQuery && (lower.includes('4') || lower.includes('four') || lower.includes('char') || lower.includes('chaar') || lower.includes('3') || lower.includes('three') || lower.includes('teen') || lower.includes('kid') || lower.includes('bachh'))) ||
      lower.includes('family of 4') ||
      lower.includes('family of 3') ||
      lower.includes('4 logo') ||
      lower.includes('4 members') ||
      lower.includes('4 log');

    if (isFamilyOf4) {
      if (isHindiScript) {
        return {
          reply: `4 सदस्यों के परिवार (Family of 4) के लिए हमारे पास 2 सबसे उपयुक्त विकल्प हैं:

🌟 **सर्वश्रेष्ठ विकल्प: Skyline Lumina 3 व 4 BHK (सेक्टर 54, गोल्फ कोर्स रोड)**
• 2,250 sq.ft कारपेट एरिया, बच्चों के लिए अलग बेडरूम एवं फैमिली लाउंज।
• 82% खुला हरा-भरा क्षेत्र, हीटेड पूल एवं टॉप इंटरनेशनल स्कूल केवल 10 मिनट की दूरी पर।
• मूल्य: ₹3.40 Cr – ₹5.80 Cr (Ready to Move | HARERA प्रमाणित)।

🏙️ **अल्ट्रा-लक्ज़री अपग्रेड: The Grand Horizon 4 BHK Sky Villa (सेक्टर 65)**
• 4,250 sq.ft डुप्लेक्स पेंटहाउस, प्राइवेट हाई-स्पीड एलिवेटर एवं रूफटॉप पूल।
• मूल्य: ₹8.50 Cr से शुरू।

आपकी प्राथमिकता किस बजट ब्रैकेट में है (₹3.5–6 Cr या ₹8 Cr+)? क्या मैं इस सप्ताहांत आपके परिवार के लिए प्राइवेट साइट विज़िट बुक कर दूँ?`,
          intent: 'question',
          service: 'Skyline Lumina 3 & 4 BHK Luxury Residences',
          budget: '₹3.40 Cr – ₹5.80 Cr',
          reasoning: 'Consultative recommendation tailored for family of 4 in Hindi.',
        };
      }

      if (isHinglish) {
        return {
          reply: `Aapki **family of 4** ke liye hamare paas 2 best-suited luxury residences hain based on lifestyle & space:

🌟 **Top Choice: Skyline Lumina 3 & 4 BHK (Sector 54, Golf Course Rd)**
• **Why it's ideal for a family of 4:** 2,250 sq.ft carpet area me expansive master bedroom, 2 dedicated kids/guest bedrooms, aur private family lounge.
• **Family & Kids Highlights:** 82% open landscaped greens, Olympic heated swimming pool, dedicated children's activity zones, Six Senses clubhouse, aur top schools (The Shri Ram School & Heritage) sirf 10 minute door.
• **Pricing:** ₹3.40 Cr – ₹5.80 Cr (Ready to Move | HARERA: RC/REP/HARERA/GGM/2024/112).

🏙️ **Ultra-Luxury Duplex: The Grand Horizon 4 BHK Sky Villa (Sector 65)**
• **Duplex Luxury:** 4,250 sq.ft duplex penthouse with private high-speed elevator jo direct aapke foyer me khulta hai, private rooftop pool, aur panoramic golf views.
• **Pricing:** Starts at ₹8.50 Cr (Ready to Move).

Aapka preferred budget bracket kya rahega (₹3.5–6 Cr ya ₹8 Cr+)? Main aapki family ke liye is weekend accompanied sample flat tour book karwa du?`,
          intent: 'question',
          service: 'Skyline Lumina 3 & 4 BHK Luxury Residences',
          budget: '₹3.40 Cr – ₹5.80 Cr',
          reasoning: 'Consultative recommendation tailored for family of 4 in Hinglish.',
        };
      }

      return {
        reply: `For a **family of 4**, we recommend two premier residences tailored for spacious family living:

🌟 **Top Recommendation: Skyline Lumina 3 & 4 BHK (Sector 54, Golf Course Rd)**
• **Why it's ideal:** 2,250 sq.ft carpet area featuring a dedicated master suite, two private children's bedrooms, and a central family lounge.
• **Family Amenities:** 82% open landscaped greens, Olympic heated pool, children's creative play zones, and proximity to top international schools (The Shri Ram School & Heritage Xperiential).
• **Pricing:** ₹3.40 Cr – ₹5.80 Cr (Ready to Move | HARERA Certified).

🏙️ **Ultra-Luxury Upgrade: The Grand Horizon 4 BHK Sky Villa (Sector 65)**
• **Duplex Luxury:** 4,250 sq.ft duplex penthouse with a private high-speed elevator opening into your private foyer, rooftop infinity pool, and golf course views.
• **Pricing:** Starts at ₹8.50 Cr.

Which budget bracket best aligns with your plans (₹3.5–6 Cr or ₹8 Cr+)? I can arrange an accompanied private family tour this weekend.`,
        intent: 'question',
        service: 'Skyline Lumina 3 & 4 BHK Luxury Residences',
        budget: '₹3.40 Cr – ₹5.80 Cr',
        reasoning: 'Consultative recommendation tailored for family of 4 in English.',
      };
    }

    // Scenario B: Large / Joint Family (5+ members, parents, multi-generational)
    const isLargeFamily =
      (isFamilyQuery && (lower.includes('5') || lower.includes('five') || lower.includes('paanch') || lower.includes('6') || lower.includes('six') || lower.includes('joint') || lower.includes('badi') || lower.includes('bada') || lower.includes('parents') || lower.includes('elderly') || lower.includes('mata pita') || lower.includes('dada dadi'))) ||
      lower.includes('joint family') ||
      lower.includes('family of 5') ||
      lower.includes('family of 6') ||
      lower.includes('5 members');

    if (isLargeFamily) {
      if (isHinglish || isHindiScript) {
        return {
          reply: `Joint / Badi family (5+ members) ke liye expansive space, elderly parents ki accessibility, aur multi-generational privacy sabse important hoti hai. Iske liye hamara signature recommendation hai:

🌳 **The Crestview Signature Golf Villas (Sector 63, Aravalli Foothills)**
• **5 BHK Independent Luxury Villas (5,800 sq.ft)**
• Ground floor master suite with zero-step access (elderly parents ke liye completely safe).
• 400 sq.yd personal landscaped lawn, basement private home cinema & wine cellar, aur heated indoor lap pool.
• Multi-tier biometric security and direct golf course buggy access.
• **Pricing:** ₹11.50 Cr – ₹18.0 Cr.

Alternately, agar aap high-rise penthouse prefer karte hain toh **The Grand Horizon 5 BHK Duplex Sky Villa** (4,250 sq.ft duplex at ₹12 Cr+) ready-to-move available hai.

Kya aap sample villa ka exclusive buggy walkthrough schedule karna chahenge?`,
          intent: 'question',
          service: 'The Crestview Signature Golf Villas',
          budget: '₹11.50 Cr – ₹18.0 Cr',
          reasoning: 'Consultative recommendation tailored for large/joint family in Hinglish.',
        };
      }

      return {
        reply: `For a large or multi-generational family (5+ members), space, privacy, and accessibility are paramount. Our signature recommendation:

🌳 **The Crestview Signature Golf Villas (Sector 63, Aravalli Foothills)**
• **5 BHK Independent Luxury Villas (5,800 sq.ft)**
• Ground-floor master suite with zero-step access—ideal for senior family members.
• 400 sq.yd private landscaped garden, basement private home theatre, and indoor heated lap pool.
• Biometric multi-tier security and direct golf buggy access.
• **Pricing:** ₹11.50 Cr – ₹18.0 Cr.

Alternatively, **The Grand Horizon 5 BHK Duplex Penthouse** (4,250 sq.ft, ₹12 Cr+) is available ready-to-move. Would you like to schedule an accompanied private villa tour?`,
        intent: 'question',
        service: 'The Crestview Signature Golf Villas',
        budget: '₹11.50 Cr – ₹18.0 Cr',
        reasoning: 'Consultative recommendation tailored for large/joint family.',
      };
    }

    // Scenario C: Couple / Nuclear / Small Family (1-2 members)
    const isCouple =
      isFamilyQuery && (lower.includes('couple') || lower.includes('2') || lower.includes('two') || lower.includes('do member') || lower.includes('nuclear') || lower.includes('bachelor') || lower.includes('husband wife'));

    if (isCouple) {
      if (isHinglish || isHindiScript) {
        return {
          reply: `Couple ya small nuclear family ke liye **Skyline Lumina 3 BHK (2,250 sq.ft)** at Sector 54, Golf Course Road absolute best luxury choice hai:\n• Pricing: ₹3.40 Cr – ₹4.20 Cr (Ready to Move).\n• Prime Golf Course Road connectivity, low-maintenance vertical living, Six Senses clubhouse, aur high rental demand.\n\nKya aap sample flat ka master plan download karna chahenge ya private site tour book karein?`,
          intent: 'question',
          service: 'Skyline Lumina 3 & 4 BHK Luxury Residences',
          budget: '₹3.40 Cr – ₹4.20 Cr',
          reasoning: 'Consultative recommendation for couple / small family in Hinglish.',
        };
      }

      return {
        reply: `For a couple or small family, **Skyline Lumina 3 BHK (2,250 sq.ft)** on Golf Course Road is our premier recommendation (₹3.40 Cr – ₹4.20 Cr). It offers low-maintenance luxury, prime connectivity, a Six Senses wellness clubhouse, and strong capital appreciation. Would you like to view the floor plans?`,
        intent: 'question',
        service: 'Skyline Lumina 3 & 4 BHK Luxury Residences',
        budget: '₹3.40 Cr – ₹4.20 Cr',
        reasoning: 'Consultative recommendation for couple / small family.',
      };
    }

    // Scenario D: Investment & Rental Yield Recommendation
    const isInvestment =
      lower.includes('invest') ||
      lower.includes('rental yield') ||
      lower.includes('rent pe') ||
      lower.includes('kiraya') ||
      lower.includes('returns') ||
      lower.includes('roi') ||
      (lower.includes('commercial') && lower.includes('best'));

    if (isInvestment) {
      if (isHinglish || isHindiScript) {
        return {
          reply: `High ROI & Rental Yield investment ke liye hamara top recommendation hai:\n\n🏢 **Skyline One Commercial Corporate Suites (CyberCity Phase 2)**\n• **Guaranteed 8.2% Gross Rental Yield** with Fortune 500 corporate leases.\n• Investment brackets: ₹2.10 Cr – ₹6.50 Cr (Ready to Move).\n• High liquidity, triple-height reception, aur instant rental cashflow from Day 1.\n\nResidential capital appreciation ke liye **The Grand Horizon Sky Villas** on Golf Course Extn Road ne last 24 months me 28% capital growth deliver ki hai.\n\nAap commercial pre-leased asset prefer karenge ya luxury residential?`,
          intent: 'question',
          service: 'Skyline One Commercial Corporate Suites',
          budget: '₹2.10 Cr – ₹6.50 Cr',
          reasoning: 'Consultative recommendation for high rental yield investment in Hinglish.',
        };
      }

      return {
        reply: `For high rental yields and institutional appreciation, we recommend:\n\n🏢 **Skyline One Commercial Corporate Suites (CyberCity Phase 2)**\n• **Guaranteed 8.2% Gross Rental Yield** with Fortune 500 corporate tenants.\n• Capital investment: ₹2.10 Cr – ₹6.50 Cr (Ready to Move).\n• Instant rental cashflow from Day 1 in Gurugram's prime corporate corridor.\n\nFor residential capital appreciation, **The Grand Horizon Sky Villas** has delivered 28% capital appreciation over the last 24 months. Which asset class best matches your investment portfolio?`,
        intent: 'question',
        service: 'Skyline One Commercial Corporate Suites',
        budget: '₹2.10 Cr – ₹6.50 Cr',
        reasoning: 'Consultative recommendation for high rental yield investment.',
      };
    }

    // Scenario E: Villa vs Penthouse Comparison
    const isComparison =
      (lower.includes('villa') && (lower.includes('flat') || lower.includes('apartment') || lower.includes('penthouse'))) ||
      lower.includes('villa vs') ||
      lower.includes('kothi ya');

    if (isComparison) {
      if (isHinglish || isHindiScript) {
        return {
          reply: `Villa vs Penthouse comparison me decision aapke lifestyle preferences par depend karta hai:\n\n🌳 **The Crestview Signature Golf Villas (₹11.50 Cr – ₹18.0 Cr)**:\n• **Best for Independent Land Ownership & Privacy:** 400 sq.yd personal landscaped lawn, basement cinema, private heated lap pool, zero shared walls, aur land title ownership.\n\n🏙️ **The Grand Horizon Sky Villas (₹8.50 Cr – ₹14.0 Cr)**:\n• **Best for Panoramic Golf Views & Effortless Living:** 42nd-floor golf course views, private elevators, rooftop infinity pool, 24/7 concierge, aur lock-and-leave convenience.\n\nAap private independent villa prefer karenge ya sky duplex?`,
          intent: 'question',
          reasoning: 'Villa vs Penthouse comparison analysis in Hinglish.',
        };
      }

      return {
        reply: `Comparing an independent villa with a sky penthouse comes down to privacy vs. skyline luxury:\n\n🌳 **The Crestview Signature Golf Villas (₹11.50 Cr – ₹18.0 Cr)**:\n• Private 400 sq.yd lawn, basement cinema, private lap pool, zero shared walls, and full freehold land ownership.\n\n🏙️ **The Grand Horizon Sky Villas (₹8.50 Cr – ₹14.0 Cr)**:\n• 42nd-floor golf views, private elevator, rooftop infinity pool, and lock-and-leave luxury concierge services.\n\nWhich lifestyle format appeals more to your family?`,
        intent: 'question',
        reasoning: 'Villa vs Penthouse comparison analysis.',
      };
    }

    // Scenario F: General "best kya rahega" / "what do you recommend" without specific criteria
    if (isRecommendationQuery && !matchedProp && !lower.includes('ghar') && !lower.includes('makan') && !lower.includes('flat')) {
      if (isHinglish || isHindiScript) {
        return {
          reply: `Aapke liye best property recommend karne ke liye mujhe 2 brief details bataiye:\n1. **Aapki family size kitni hai** (e.g. 3-4 members, joint family, ya couple)?\n2. **Aapka preferred budget bracket kya hai** (₹3.5–6 Cr luxury condo, ₹8.5–14 Cr penthouse, ya ₹11.5–18 Cr independent golf villa)?\n\nYe batate hi main aapko exact matching floor plans aur sample flat site visit arrange karwa dunga!`,
          intent: 'question',
          reasoning: 'Consultative needs discovery prompt in Hinglish.',
        };
      }

      return {
        reply: `To recommend the best property tailored to your needs, could you share two quick preferences:\n1. **Your family size / living profile** (e.g., family of 4, multi-generational, or couple)?\n2. **Your preferred investment range** (₹3.5–6 Cr luxury condo, ₹8.5–14 Cr penthouse, or ₹11.5–18 Cr independent villa)?\n\nI will instantly match the ideal floor plan and arrange a private showing.`,
        intent: 'question',
        reasoning: 'Consultative needs discovery prompt.',
      };
    }

    // 5. Site Visit Booking Intent (English + Hinglish + Hindi)
    const bookingKeywords = [
      'site visit', 'visit', 'tour', 'walkthrough', 'schedule', 'kal', 'tomorrow',
      'sunday', 'saturday', 'weekend', 'baje', 'am', 'pm', 'book', 'dekhne aana',
      'aana hai', 'dekhna hai', 'pickup', 'chauffeur', 'gaadi', 'car bhej do',
    ];
    const isExplicitBooking =
      lower.includes('visit') ||
      lower.includes('tour') ||
      lower.includes('schedule') ||
      lower.includes('book') ||
      lower.includes('dekhne aana') ||
      lower.includes('aana chahta') ||
      lower.includes('gaadi bhej') ||
      ((lower.includes('kal') || lower.includes('sunday') || lower.includes('saturday') || lower.includes('tomorrow')) &&
        (lower.includes('baje') || lower.includes('time') || lower.includes('slot') || lower.includes('free') || lower.includes('aa raha')));

    if (isExplicitBooking) {
      const propTitle = matchedProp ? matchedProp.title : 'The Grand Horizon Penthouse & Sky Villas';
      const preferredDate = lower.includes('sunday')
        ? (isHinglish ? 'Is Sunday (रविवार)' : 'This Sunday')
        : lower.includes('saturday')
        ? (isHinglish ? 'Is Saturday (शनिवार)' : 'This Saturday')
        : lower.includes('tomorrow') || lower.includes('kal')
        ? (isHinglish ? 'Kal (Tomorrow)' : 'Tomorrow')
        : (isHinglish ? 'Upcoming Weekend' : 'Upcoming Weekend');

      const gatePass = `VIP-${Math.floor(1000 + Math.random() * 9000)}`;

      if (isHinglish || isHindiScript) {
        return {
          reply: `Shandar! ${propTitle} ke liye aapka VIP Private Site Visit confirm kar diya gaya hai (${preferredDate}).\n\n📍 Location: Horizon Experience Lounge, Two Horizon Centre, Golf Course Rd, Gurugram\n🎟️ VIP Gate Pass Code: #${gatePass}\n👨‍💼 Host: Raghav Singhal (Managing Director)\n🚗 Chauffeur Service: Private Mercedes-Benz pickup available\n\nKya aapko aapke residence se complimentary chauffeur pickup car arrange karwani hai?`,
          intent: 'book',
          service: propTitle,
          preferred_date: preferredDate,
          reasoning: 'Extracted site visit booking intent in Hinglish, generated VIP gate pass.',
        };
      }

      return {
        reply: `Excellent! Your VIP Private Site Visit for ${propTitle} has been confirmed for ${preferredDate}. Raghav Singhal (Managing Director) will receive you at our Horizon Experience Lounge (Two Horizon Centre, Golf Course Rd). Gate Pass Code: #${gatePass}. Would you require complimentary chauffeur pickup from your residence?`,
        intent: 'book',
        service: propTitle,
        preferred_date: preferredDate,
        reasoning: 'Extracted site visit booking intent, reserved VIP tour with gate pass.',
      };
    }

    // 6. Pricing & Inventory Inquiry or Specific Property Match
    const priceKeywords = [
      'price', 'cost', 'kitna', 'kitne', 'rate', 'starting', 'crore', 'cr',
      'budget', 'sqft', 'carpet', 'area', 'daam', 'bhav',
    ];
    const isPriceQuery = priceKeywords.some((kw) => lower.includes(kw));

    if (matchedProp && (isPriceQuery || lower.includes('bhk') || lower.includes('villa') || lower.includes('penthouse') || lower.includes('carpet'))) {
      if (isHinglish || isHindiScript) {
        return {
          reply: `✨ **${matchedProp.title}** (${matchedProp.location}):\n• Price: ${matchedProp.price_display}\n• Configuration: ${matchedProp.configuration}\n• Carpet Area: ${matchedProp.carpet_area_sqft.toLocaleString()} sq.ft\n• Key Amenities: ${matchedProp.amenities.slice(0, 3).join(', ')}\n• RERA: ${matchedProp.rera_number}\n\nKya aap iska detailed architectural floor plan dekhna chahenge ya sample sky villa ka private site visit arrange karein?`,
          intent: 'question',
          service: matchedProp.title,
          budget: matchedProp.price_display,
          reasoning: `Extracted property ${matchedProp.title} and quoted RERA-grounded pricing and carpet area in Hinglish.`,
        };
      }

      return {
        reply: `${matchedProp.title} (${matchedProp.location}) starts at ${matchedProp.price_display} for ${matchedProp.configuration} with ${matchedProp.carpet_area_sqft.toLocaleString()} sq.ft carpet area. Key highlights: ${matchedProp.amenities.slice(0, 3).join(', ')}. (RERA: ${matchedProp.rera_number}). Would you like to schedule a private preview or download the floor plans?`,
        intent: 'question',
        service: matchedProp.title,
        budget: matchedProp.price_display,
        reasoning: `Extracted property ${matchedProp.title} and quoted RERA-grounded pricing and carpet area.`,
      };
    }

    // 7. General Property Inquiry ("ghar dikhado", "flat dikhao", "options batao", "show houses", "projects")
    const showPropertyKeywords = [
      'ghar dikhado', 'ghar dikhao', 'makan dikhao', 'flat dikhao', 'flat dekhna',
      'kothi dekhni', 'ghar dekhna', 'options batao', 'options dikhao', 'properties dikhao',
      'projects dikhao', 'kya options', 'kya kya hai', 'options kya hai', 'portfolio dikhao',
      'sample flat', 'ghar', 'flats', 'properties', 'projects', 'portfolio', 'options',
      'show me', 'show houses', 'show properties', 'available', 'best properties',
    ];

    if (showPropertyKeywords.some((kw) => lower.includes(kw)) || isPriceQuery) {
      if (isHindiScript) {
        return {
          reply: `नमस्ते! स्काईलाइन लक्ज़री एस्टेट्स में आपका स्वागत है। हमारे पास गुरुग्राम के सबसे प्रतिष्ठित प्रोजेक्ट्स उपलब्ध हैं:

🏙️ The Grand Horizon Sky Villas (गोल्फ कोर्स एक्सटेंशन रोड)
• 4 व 5 BHK डुप्लेक्स | 4,250 sq.ft | ₹8.50 Cr – ₹14.0 Cr

🌳 The Crestview Signature Golf Villas (अरावली हिल्स, सेक्टर 63)
• 5 BHK स्वतंत्र विला | 5,800 sq.ft | ₹11.50 Cr – ₹18.0 Cr

✨ Skyline Lumina Residences (सेक्टर 54, गोल्फ कोर्स रोड)
• 3 व 4 BHK लक्ज़री अपार्टमेंट्स | 2,250 sq.ft | ₹3.40 Cr – ₹5.80 Cr

🏢 Skyline One Commercial Suites (साइबर सिटी)
• ग्रेड-ए ऑफिस एवं रिटेल | ₹2.10 Cr+ (8.2% रेंटल यील्ड)

आप किस प्रोजेक्ट का फ्लोर प्लान या प्राइवेट साइट विज़िट बुक करना चाहेंगे?`,
          intent: 'question',
          reasoning: 'Provided luxury portfolio in Hindi script.',
        };
      }

      if (isHinglish) {
        return {
          reply: `Namaste! Skyline Luxury Estates me hamare paas Gurugram ki sabse prestigious locations par ultra-luxury residences available hain:

🏙️ **The Grand Horizon Sky Villas** (Golf Course Extn Rd, Sec 65)
• 4 & 5 BHK Duplex | 4,250 sq.ft | ₹8.50 Cr – ₹14.0 Cr
• Private elevator, golf course view deck & private rooftop pool

🌳 **The Crestview Signature Golf Villas** (Aravallis, Sec 63)
• 5 BHK Independent Villas | 5,800 sq.ft | ₹11.50 Cr – ₹18.0 Cr
• 400 sq.yd personal lawn, basement cinema & heated lap pool

✨ **Skyline Lumina Residences** (Sector 54, Golf Course Rd)
• 3 & 4 BHK Luxury Condos | 2,250 sq.ft | ₹3.40 Cr – ₹5.80 Cr
• 82% open landscaped greens & EV fast-charging lounge

🏢 **Skyline One Commercial Suites** (CyberCity Phase 2)
• Grade-A Office Suites | ₹2.10 Cr – ₹6.50 Cr (8.2% Rental Yield)

Aapko kis type ki property dekhni hai? Main floor plan bhej du ya kal private chauffeur site visit arrange karwa du?`,
          intent: 'question',
          reasoning: 'Provided luxury portfolio overview in fluent Hinglish answering ghar dikhado.',
        };
      }

      // Return high-ticket portfolio overview in English
      return {
        reply: `Namaste! Skyline Luxury Estates offers premier developments along Golf Course Road & CyberCity:\n• The Grand Horizon Sky Villas: ₹8.50 Cr – ₹14.0 Cr (4 & 5 BHK Duplex | 4,250 sq.ft)\n• The Crestview Golf Villas: ₹11.50 Cr – ₹18.0 Cr (5 BHK Independent | 5,800 sq.ft)\n• Skyline Lumina 3 & 4 BHK: ₹3.40 Cr – ₹5.80 Cr (2,250 sq.ft)\n• Skyline One Commercial Suites: ₹2.10 Cr+ (8.2% Rental Yield)\n\nWhich configuration best matches your lifestyle or investment goals? I can dispatch the architectural dossier or arrange an accompanied private chauffeur tour.`,
        intent: 'question',
        reasoning: 'Provided luxury portfolio pricing overview.',
      };
    }

    // Default friendly luxury greeting
    if (isHinglish || isHindiScript) {
      return {
        reply: `Namaste! Skyline Luxury Estates Gurugram me aapka swagat hai. Main aapka autonomous luxury property consultant hoon. Main aapko verified RERA pricing (₹ Crores me), confidential floor plans, ya private chauffeur site visit schedule karwa sakta hoon. Aaj aapki property search me main kaise madad kar sakta hoon?`,
        intent: 'question',
        reasoning: 'Default luxury real estate greeting in Hinglish.',
      };
    }

    return {
      reply: `Namaste! Welcome to ${config.name}, Gurugram. I am your autonomous luxury property consultant. I can provide confidential floor plans, exact pricing in ₹ Crores, RERA compliance details, or arrange an accompanied chauffeur site visit. How may I assist your property search today?`,
      intent: 'question',
      reasoning: 'Default luxury real estate greeting and qualification prompt.',
    };
  }

  private async callGemini(
    text: string,
    history: Message[],
    config: BusinessConfig,
    apiKey: string
  ): Promise<AIResponsePayload> {
    const prompt = this.buildSystemPrompt(config);
    const messagesHistory = history
      .slice(-6)
      .map((m) => `${m.sender}: ${m.body}`)
      .join('\n');

    const fullPrompt = `${prompt}\n\nRecent Conversation History:\n${messagesHistory}\n\nCustomer: ${text}\n\nRespond ONLY with valid JSON:
{
  "reply": "courteous, elite real estate advisor message in English/Hindi/Hinglish",
  "intent": "book" | "question" | "human" | "refusal" | "brochure",
  "name": "Customer Name or null",
  "preferred_date": "Date/Time string or null",
  "service": "Matched property title or null",
  "budget": "Budget bracket or null",
  "reasoning": "brief rationale"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      }
    );

    if (!res.ok) throw new Error(`Gemini error: ${res.statusText}`);
    const data = await res.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return JSON.parse(candidateText) as AIResponsePayload;
  }

  private async callOpenAI(
    text: string,
    history: Message[],
    config: BusinessConfig,
    apiKey: string
  ): Promise<AIResponsePayload> {
    const systemPrompt = this.buildSystemPrompt(config);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map((m) => ({
        role: m.sender === 'CUSTOMER' ? 'user' : 'assistant',
        content: m.body,
      })),
      { role: 'user', content: text },
    ];

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        response_format: { type: 'json_object' },
      }),
    });

    if (!res.ok) throw new Error(`OpenAI error: ${res.statusText}`);
    const data = await res.json();
    return JSON.parse(data.choices?.[0]?.message?.content) as AIResponsePayload;
  }

  private buildSystemPrompt(config: BusinessConfig): string {
    const propertyTable = (config.properties || [])
      .map(
        (p) =>
          `- ${p.title} (${p.location}): ${p.price_display} | ${p.configuration} | ${p.carpet_area_sqft} sq.ft | RERA: ${p.rera_number}`
      )
      .join('\n');

    return `You are the Senior Luxury Real Estate Consultant for ${config.name} (${config.address}).
Managing Director: ${config.doctor_name}
RERA License: ${config.rera_registration || 'HARERA-GGM-2024-9182'}

EXCLUSIVE PROPERTY PORTFOLIO:
${propertyTable}

RULES & META 2026 COMPLIANCE:
1. Tone: Polite, articulate, knowledgeable, professional luxury consultant. Fluent in English, Hindi, and natural Hinglish.
2. Grounding: ONLY discuss properties in the portfolio. Quote exact prices in ₹ Crores and carpet areas.
3. Site Visits: Proactively offer accompanied private showings with chauffeur pickup for weekend slots.
4. Refusals: Politely decline all non-real-estate requests (poems, jokes, homework, coding).
5. Transparency: Always confirm you are the AI property advisor if asked.
6. Handover: Escalate immediately to Managing Director Raghav Singhal if negotiations or customized payment plans are requested.`;
  }
}

export const aiAgent = new WhatsAppRealEstateAgent();
