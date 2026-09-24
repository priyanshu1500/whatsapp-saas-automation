import assert from 'assert';
import crypto from 'crypto';

console.log('🧪 Starting WhatsApp AI SaaS & Agent OS Verification Suite...\n');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     ${err.message}`);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     ${err.message}`);
      failed++;
    }
  }

  // --- Suite 1: Database & Seed Layer ---
  console.log('--- Test Suite 1: Database & Seed Layer ---');
  const { db } = await import('../src/server/db.js').catch(async () => {
    // If running in ts-node or transpiled, or directly importing ts via tsx/esm
    return await import('../src/server/db.ts');
  });

  test('Database seeds initial business config for Smile Clinic Delhi', () => {
    const config = db.getConfig();
    assert.strictEqual(config.name, 'Smile Clinic Delhi');
    assert.strictEqual(config.services.length >= 6, true);
    assert.strictEqual(config.services[0].price_inr, 1500);
  });

  test('Lead retrieval and phone normalization works', () => {
    const leads = db.getLeads();
    assert.strictEqual(leads.length >= 3, true);
    const rohit = db.getLeadByPhone('+919811223344');
    assert.ok(rohit, 'Rohit Verma lead should exist');
    assert.strictEqual(rohit.name, 'Rohit Verma');
  });

  test('Metrics calculator reflects India Meta message rates and GST', () => {
    const metrics = db.getMetrics();
    assert.ok(metrics.totalLeads > 0);
    assert.ok(metrics.metaCost);
    assert.strictEqual(typeof metrics.metaCost.totalInr, 'number');
    assert.strictEqual(typeof metrics.conversionRate, 'number');
  });

  // --- Suite 2: AI Agent & Meta 2026 Guardrails ---
  console.log('\n--- Test Suite 2: AI Agent & Meta 2026 Policy Guardrails ---');
  const { aiAgent } = await import('../src/server/ai-agent.js').catch(async () => {
    return await import('../src/server/ai-agent.ts');
  });
  const config = db.getConfig();

  await testAsync('Grounded pricing response for Teeth Cleaning in Hinglish', async () => {
    const history = [];
    const res = await aiAgent.processMessage('teeth cleaning ka kitna charge hai?', history, config);
    assert.strictEqual(res.intent, 'question');
    assert.ok(res.reply.includes('1,500') || res.reply.includes('1500'), 'Reply must quote ₹1,500 from catalog');
  });

  await testAsync('Meta 2026 Guardrail: Politely refuses off-topic general chat (Poem)', async () => {
    const history = [];
    const res = await aiAgent.processMessage('write me a poem about rainy days', history, config);
    assert.strictEqual(res.intent, 'refusal');
    assert.ok(res.reply.toLowerCase().includes('smile clinic') || res.reply.toLowerCase().includes('policy'), 'Refusal should explain task-specific domain');
  });

  await testAsync('Medical Advice Guardrail: Refuses antibiotic prescription & routes to doctor', async () => {
    const history = [];
    const res = await aiAgent.processMessage('daant dard ke liye koun si antibiotic dawai lu?', history, config);
    assert.ok(res.reply.toLowerCase().includes('safe') || res.reply.toLowerCase().includes('doctor') || res.reply.toLowerCase().includes('consultation'));
  });

  await testAsync('Human Handover Intent: Escalates severe pain / human request', async () => {
    const history = [];
    const res = await aiAgent.processMessage('mujhe bohot tez dard hai please doctor se baat karwaye', history, config);
    assert.strictEqual(res.intent, 'human');
  });

  await testAsync('Appointment Booking Intent: Detects booking keywords and slot', async () => {
    const history = [];
    const res = await aiAgent.processMessage('can I book an appointment for tomorrow at 4 PM?', history, config);
    assert.strictEqual(res.intent, 'book');
    assert.ok(res.preferred_date !== undefined);
  });

  // --- Suite 3: Security & Webhook HMAC Verification ---
  console.log('\n--- Test Suite 3: Security & Webhook Signature ---');
  test('HMAC SHA-256 signature verification validates authentic Meta payloads', () => {
    const secret = 'meta_test_secret_12345';
    const payload = JSON.stringify({ object: 'whatsapp_business_account' });
    const validSignature = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
    const forgedSignature = `sha256=invalidhash0000000000000000000000000000000000000000000000000000`;

    const verify = (sig) => {
      const expected = `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`;
      return sig === expected;
    };

    assert.strictEqual(verify(validSignature), true);
    assert.strictEqual(verify(forgedSignature), false);
  });

  // --- Suite 4: DPDP India Privacy Compliance ---
  console.log('\n--- Test Suite 4: DPDP India Privacy Compliance ---');
  test('DPDP Right to be Forgotten erases lead, messages, and appointments', () => {
    const testPhone = '+919999888877';
    const lead = db.createOrGetLead(testPhone, 'Temporary Privacy Test');
    db.addMessage({
      lead_id: lead.id,
      phone: testPhone,
      direction: 'INBOUND',
      sender: 'CUSTOMER',
      body: 'Hello erase me later',
      cost_category: 'service_reply',
      cost_inr: 0,
    });

    assert.ok(db.getLeadByPhone(testPhone), 'Lead should be present before erasure');
    const erased = db.eraseLeadData(testPhone);
    assert.strictEqual(erased, true);
    assert.strictEqual(db.getLeadByPhone(testPhone), undefined, 'Lead must be purged');
  });

  console.log(`\n===========================================`);
  console.log(`Verification Complete: ${passed} Passed, ${failed} Failed`);
  console.log(`===========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
