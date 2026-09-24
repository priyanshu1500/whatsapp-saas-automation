import { AIResponsePayload, BusinessConfig, Message } from '@/types';

export class WhatsAppAIAgent {
  /**
   * Main entry point to process an inbound WhatsApp message
   */
  async processMessage(
    incomingText: string,
    history: Message[],
    config: BusinessConfig
  ): Promise<AIResponsePayload> {
    const text = incomingText.trim();

    // Check environment for LLM keys
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

    // Default: Built-in Intelligent Local NLP Engine
    return this.processLocally(text, history, config);
  }

  /**
   * Local Rule & NLP Engine adhering strictly to Meta 2026 AI Policy
   */
  private processLocally(
    text: string,
    history: Message[],
    config: BusinessConfig
  ): AIResponsePayload {
    const lower = text.toLowerCase();

    // 1. Off-topic check (Meta 2026 Policy: general chatbots banned)
    const offtopicKeywords = [
      'poem', 'shayari', 'song', 'joke', 'movie', 'cricket score', 'python code',
      'javascript', 'weather', 'recipe', 'biryani', 'politics', 'modi', 'trump', 'who is',
    ];
    if (
      config.guardrail_refuse_offtopic &&
      offtopicKeywords.some((kw) => lower.includes(kw)) &&
      !lower.includes('clinic') &&
      !lower.includes('appointment') &&
      !lower.includes('tooth') &&
      !lower.includes('teeth') &&
      !lower.includes('daant')
    ) {
      return {
        reply: `Namaste! I am the automated WhatsApp assistant for ${config.name}. To serve patients best and comply with Meta's messaging policies, I can only assist with clinic timings, prices, and booking appointments. How can I help with your dental health today?`,
        intent: 'refusal',
        reasoning: 'Off-topic query caught by Meta 2026 guardrail.',
        refused_reason: 'Meta 2026 General-Chatbot Policy Compliance',
      };
    }

    // 2. Medical Diagnosis / Prescription check (Never give medical diagnoses)
    const medicalAdviceKeywords = [
      'which medicine', 'koun si dawai', 'antibiotic', 'painkiller', 'prescription',
      'diagnose', 'kya rog hai', 'bimari', 'brufen', 'amoxicillin', 'tablet batao'
    ];
    if (
      config.guardrail_refuse_medical &&
      medicalAdviceKeywords.some((kw) => lower.includes(kw))
    ) {
      return {
        reply: `Main ek AI assistant hoon aur direct medicines prescribe ya diagnose nahi kar sakta. ${config.doctor_name} se proper check-up karwana sabse safe rahega. Kya main aapke liye ek consultation slot book kar doon?`,
        intent: 'question',
        service: 'Dental Consultation & X-Ray',
        reasoning: 'Medical diagnosis inquiry deflected to human doctor consultation.',
      };
    }

    // 3. Bot Disclosure Check ("Am I talking to a bot?")
    const botQueryKeywords = ['are you a bot', 'are you ai', 'kya tum bot ho', 'kya tum robot ho', 'human or bot'];
    if (
      config.guardrail_honest_bot &&
      botQueryKeywords.some((kw) => lower.includes(kw))
    ) {
      return {
        reply: `Yes! Main ${config.name} ka official AI Assistant hoon. Main aapke sawalon ke jawab 24/7 turant de sakta hoon aur appointments book kar sakta hoon. Agar aap clinic staff se baat karna chahte hain, toh 'human' reply karein!`,
        intent: 'question',
        reasoning: 'Honest AI bot disclosure provided.',
      };
    }

    // 4. Human Handover Request
    const humanKeywords = ['talk to human', 'doctor se baat', 'call me', 'staff', 'receptionist', 'urgent pain', 'bohot tez dard', 'human agent'];
    if (humanKeywords.some((kw) => lower.includes(kw))) {
      return {
        reply: `Aapki request receive ho gayi hai. Main hamare clinic staff ko notify kar raha hoon. Hum jaldi hi aapse is number par contact karenge.`,
        intent: 'human',
        reasoning: 'User requested human assistance or expressed urgent discomfort.',
      };
    }

    // 5. Booking Intent
    const bookingKeywords = ['book', 'appointment', 'slot', 'kal', 'tomorrow', 'today', 'shaam', 'subah', 'schedule', 'timing'];
    const isBookingIntent = bookingKeywords.some((kw) => lower.includes(kw));

    // Match service from catalog
    let matchedService = config.services.find((s) =>
      lower.includes(s.name.toLowerCase()) ||
      (s.name.toLowerCase().includes('cleaning') && (lower.includes('cleaning') || lower.includes('clean'))) ||
      (s.name.toLowerCase().includes('root canal') && (lower.includes('rct') || lower.includes('root canal'))) ||
      (s.name.toLowerCase().includes('whitening') && lower.includes('whitening')) ||
      (s.name.toLowerCase().includes('implant') && lower.includes('implant')) ||
      (s.name.toLowerCase().includes('aligner') && lower.includes('aligner')) ||
      (s.name.toLowerCase().includes('consultation') && (lower.includes('consult') || lower.includes('checkup') || lower.includes('check up')))
    );

    if (isBookingIntent && (lower.includes('kal') || lower.includes('tomorrow') || lower.includes('baje') || lower.includes('pm') || lower.includes('am') || lower.includes('book'))) {
      const serviceName = matchedService ? matchedService.name : 'Dental Consultation & X-Ray';
      const preferredDate = lower.includes('kal') || lower.includes('tomorrow') ? 'Tomorrow' : 'Upcoming Slot';
      
      return {
        reply: `Bilkul! Maine aapka slot ${serviceName} ke liye ${config.name} (${config.address}) me note kar liya hai. Dr. ${config.doctor_name} aapse milne ke liye taiyar rahenge. Clinic timings: ${config.timings}. Aapko ek WhatsApp reminder bhi bhej diya jayega!`,
        intent: 'book',
        service: serviceName,
        preferred_date: preferredDate,
        reasoning: 'Customer provided booking details, confirmed slot and booked.',
      };
    }

    // 6. Pricing & Services Inquiry
    const priceKeywords = ['cost', 'price', 'kitna', 'charge', 'rate', 'fees', 'kitne'];
    if (priceKeywords.some((kw) => lower.includes(kw)) || matchedService) {
      if (matchedService) {
        return {
          reply: `${config.name} me ${matchedService.name} ka charge ₹${matchedService.price_inr.toLocaleString('en-IN')} hai (${matchedService.description}). Kya aap iske liye koi convenient day ya time pe appointment book karna chahenge?`,
          intent: 'question',
          service: matchedService.name,
          reasoning: `Extracted service ${matchedService.name} and quoted exact catalog price.`,
        };
      }

      // Return brief price overview
      const priceSummary = config.services
        .slice(0, 4)
        .map((s) => `• ${s.name}: ₹${s.price_inr.toLocaleString('en-IN')}`)
        .join('\n');

      return {
        reply: `Namaste! Smile Clinic Delhi ke main service charges yeh hain:\n${priceSummary}\n\nAap kis treatment ke liye consult karna chahte hain?`,
        intent: 'question',
        reasoning: 'General pricing overview provided from catalog.',
      };
    }

    // 7. Clinic Address & Timings
    if (lower.includes('address') || lower.includes('location') || lower.includes('kahan') || lower.includes('kaha')) {
      return {
        reply: `${config.name} ka address hai:\n📍 ${config.address}\n🕒 Timings: ${config.timings}\nKya aap kal ya kisi specific din visit karna chahenge?`,
        intent: 'question',
        reasoning: 'Address and timings provided.',
      };
    }

    // Default friendly greeting & qualifier
    return {
      reply: `Namaste! ${config.name} me aapka swagat hai. Main aapki kya madad kar sakta hoon? Aap services ke prices jaan sakte hain ya Dr. ${config.doctor_name} ke saath appointment book kar sakte hain.`,
      intent: 'question',
      reasoning: 'Default greeting and qualification prompt.',
    };
  }

  /**
   * Gemini API integration for structured JSON reasoning
   */
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

    const fullPrompt = `${prompt}\n\nRecent Conversation History:\n${messagesHistory}\n\nCustomer: ${text}\n\nRespond ONLY with valid JSON following this format:
{
  "reply": "friendly message in Hindi/Hinglish/English",
  "intent": "book" | "question" | "human" | "refusal",
  "name": "Customer Name or null",
  "preferred_date": "Date/Time string or null",
  "service": "Matched service or null",
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
    if (!candidateText) throw new Error('No candidate returned');

    return JSON.parse(candidateText) as AIResponsePayload;
  }

  /**
   * OpenAI API integration
   */
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
    const content = data.choices?.[0]?.message?.content;
    return JSON.parse(content) as AIResponsePayload;
  }

  private buildSystemPrompt(config: BusinessConfig): string {
    const priceTable = config.services
      .map((s) => `- ${s.name}: ₹${s.price_inr} (${s.description})`)
      .join('\n');

    return `You are the friendly WhatsApp AI Assistant for ${config.name}, located at ${config.address}.
Operating Hours: ${config.timings}
Head Doctor: ${config.doctor_name}

CATALOG & PRICE LIST:
${priceTable}

META 2026 AI POLICY & CLINIC RULES:
1. Speak in the customer's language (fluent English, Hindi, or natural Hinglish).
2. ONLY discuss ${config.name}. Politely refuse general chat, poems, trivia, recipes, coding, or unrelated tasks.
3. NEVER provide medical diagnoses or prescribe medications. If asked, suggest booking a consultation with Dr. ${config.doctor_name}.
4. If the customer asks if you are an AI or bot, honestly confirm that you are the AI assistant for ${config.name}.
5. If the customer is angry, in severe pain, or asks for human/staff, set intent to "human" and inform them clinic staff will contact them.
6. Keep replies concise, warm, professional, and suitable for WhatsApp bubbles.`;
  }
}

export const aiAgent = new WhatsAppAIAgent();
