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
   */
  private processLocally(
    text: string,
    history: Message[],
    config: BusinessConfig
  ): AIResponsePayload {
    const lower = text.toLowerCase();
    const properties = config.properties || [];

    // 1. Off-topic check (Meta Jan 15 2026 Policy)
    const offtopicKeywords = [
      'poem', 'shayari', 'song', 'joke', 'movie', 'cricket', 'python', 'javascript',
      'weather', 'recipe', 'biryani', 'politics', 'modi', 'trump', 'who is',
    ];
    if (
      config.guardrail_refuse_offtopic &&
      offtopicKeywords.some((kw) => lower.includes(kw)) &&
      !lower.includes('skyline') &&
      !lower.includes('property') &&
      !lower.includes('flat') &&
      !lower.includes('bhk') &&
      !lower.includes('villa') &&
      !lower.includes('penthouse')
    ) {
      return {
        reply: `Namaste! I am the automated WhatsApp property advisor for ${config.name}. To ensure the highest standard of service and comply with Meta's messaging policies, I can only assist with property details, floor plans, pricing in ₹ Crores, and scheduling private VIP site visits. How may I assist your real estate journey today?`,
        intent: 'refusal',
        reasoning: 'Off-topic query caught by Meta 2026 task-focused guardrail.',
        refused_reason: 'Meta 2026 General-Chatbot Policy Compliance',
      };
    }

    // 2. Bot Transparency Disclosure ("Are you a bot?")
    const botQueryKeywords = ['are you a bot', 'are you ai', 'kya tum bot ho', 'kya tum robot ho', 'human or bot'];
    if (
      config.guardrail_honest_bot &&
      botQueryKeywords.some((kw) => lower.includes(kw))
    ) {
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
    ];
    if (humanKeywords.some((kw) => lower.includes(kw))) {
      return {
        reply: `Understood. I have flagged your request with priority to our Managing Director, Mr. Raghav Singhal. He will contact you directly on this number shortly to discuss bespoke terms and commercial structures.`,
        intent: 'human',
        reasoning: 'Buyer requested human broker intervention or bespoke commercial discussion.',
      };
    }

    // 4. Digital Brochure / Floor Plan Download Intent
    const brochureKeywords = ['brochure', 'floor plan', 'layout', 'master plan', 'dossier', 'pdf', 'lookbook', 'deck'];
    if (brochureKeywords.some((kw) => lower.includes(kw))) {
      return {
        reply: `Certainly! You can download the confidential architectural lookbook & master floor plans for ${config.name} at: https://skyline-estates.com/dossier.pdf (RERA ID: ${config.rera_registration || 'HARERA-GGM-2024-9182'}). Would you like to schedule an accompanied sample sky villa walkthrough this week?`,
        intent: 'brochure',
        service: 'Digital Brochure & Lookbook Dossier',
        reasoning: 'Buyer requested floor plans and brochure.',
      };
    }

    // Match property from catalog
    let matchedProp: PropertyListing | undefined;
    if (lower.includes('grand') || lower.includes('horizon') || lower.includes('penthouse') || lower.includes('sky villa')) {
      matchedProp = properties.find((p) => p.slug.includes('grand-horizon')) || properties[0];
    } else if (lower.includes('lumina') || lower.includes('3 bhk') || lower.includes('4 bhk') || lower.includes('sector 54')) {
      matchedProp = properties.find((p) => p.slug.includes('lumina')) || properties[1];
    } else if (lower.includes('crestview') || lower.includes('golf') || lower.includes('villa')) {
      matchedProp = properties.find((p) => p.slug.includes('crestview')) || properties[2];
    } else if (lower.includes('commercial') || lower.includes('office') || lower.includes('retail') || lower.includes('rental yield')) {
      matchedProp = properties.find((p) => p.slug.includes('commercial')) || properties[3];
    }

    // 5. Site Visit Booking Intent
    const bookingKeywords = ['site visit', 'visit', 'tour', 'walkthrough', 'schedule', 'kal', 'tomorrow', 'sunday', 'saturday', 'baje', 'am', 'pm', 'book'];
    const isBookingIntent = bookingKeywords.some((kw) => lower.includes(kw));

    if (
      isBookingIntent &&
      (lower.includes('visit') ||
        lower.includes('tour') ||
        lower.includes('sunday') ||
        lower.includes('tomorrow') ||
        lower.includes('saturday') ||
        lower.includes('kal') ||
        lower.includes('am') ||
        lower.includes('pm'))
    ) {
      const propTitle = matchedProp ? matchedProp.title : 'The Grand Horizon Penthouse & Sky Villas';
      const preferredDate = lower.includes('sunday')
        ? 'This Sunday'
        : lower.includes('tomorrow') || lower.includes('kal')
        ? 'Tomorrow'
        : 'Upcoming Weekend';

      return {
        reply: `Excellent! Your VIP Private Site Visit for ${propTitle} has been confirmed for ${preferredDate}. Raghav Singhal (Managing Director) will receive you at our Horizon Experience Lounge (Two Horizon Centre, Golf Course Rd). Gate Pass Code: #VIP-${Math.floor(1000 + Math.random() * 9000)}. Would you require complimentary chauffeur pickup from your residence?`,
        intent: 'book',
        service: propTitle,
        preferred_date: preferredDate,
        reasoning: 'Extracted site visit booking intent, reserved VIP tour with gate pass.',
      };
    }

    // 6. Pricing & Inventory Inquiry
    const priceKeywords = ['price', 'cost', 'kitna', 'rate', 'starting', 'crore', 'cr', 'budget', 'sqft', 'carpet'];
    if (priceKeywords.some((kw) => lower.includes(kw)) || matchedProp) {
      if (matchedProp) {
        return {
          reply: `${matchedProp.title} (${matchedProp.location}) starts at ${matchedProp.price_display} for ${matchedProp.configuration} with ${matchedProp.carpet_area_sqft.toLocaleString()} sq.ft carpet area. Key highlights: ${matchedProp.amenities.slice(0, 3).join(', ')}. (RERA: ${matchedProp.rera_number}). Would you like to schedule a private preview or download the floor plans?`,
          intent: 'question',
          service: matchedProp.title,
          budget: matchedProp.price_display,
          reasoning: `Extracted property ${matchedProp.title} and quoted RERA-grounded pricing and carpet area.`,
        };
      }

      // Return high-ticket portfolio overview
      return {
        reply: `Namaste! Skyline Luxury Estates offers premier developments along Golf Course Road & CyberCity:\n• The Grand Horizon Sky Villas: ₹8.50 Cr – ₹14.0 Cr (4,250 sq.ft)\n• Skyline Lumina 3 & 4 BHK: ₹3.40 Cr – ₹5.80 Cr (2,250 sq.ft)\n• The Crestview Golf Villas: ₹11.50 Cr – ₹18.0 Cr (5,800 sq.ft)\n• Skyline One Commercial Suites: ₹2.10 Cr+ (8.2% Rental Yield)\n\nWhich configuration best matches your lifestyle or investment goals?`,
        intent: 'question',
        reasoning: 'Provided luxury portfolio pricing overview.',
      };
    }

    // Default friendly luxury greeting
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
