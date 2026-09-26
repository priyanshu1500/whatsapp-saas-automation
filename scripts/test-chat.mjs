async function testBooking() {
  const payload = {
    phone: '+919811223344',
    name: 'Vikramaditya Singhania',
    message: 'Yes, please schedule a private site visit for tomorrow at 11 AM with chauffeur pickup for Grand Horizon.',
  };

  const res = await fetch('http://localhost:3001/api/simulator/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log('Status:', res.status);
  console.log('\n--- AI RESPONSE ---');
  console.log(data.reply);
  console.log('\n--- INTENT ---');
  console.log(data.intent);
  console.log('\n--- SITE VISIT APPOINTMENT CREATED ---');
  console.log(data.newAppointment ? JSON.stringify(data.newAppointment, null, 2) : 'None');
}

testBooking().catch(console.error);
