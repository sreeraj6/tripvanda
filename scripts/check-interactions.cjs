const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const handlers = {};
const nodes = {};
for (const selector of ['[data-quick-form]', '[data-enquiry-form]']) {
  nodes[selector] = { addEventListener: (name, fn) => { handlers[selector] = fn; } };
}
let assigned;
const context = {
  document: {
    querySelector: selector => nodes[selector] || null,
    querySelectorAll: () => [],
  },
  window: { location: { assign: url => { assigned = url; } } },
  FormData: class { constructor(form) { this.values = form.values; } get(k) { return this.values[k]; } },
  Date, encodeURIComponent,
};
vm.runInNewContext(fs.readFileSync('assets/main.js', 'utf8'), context);
function send(selector, values) {
  let prevented = false;
  handlers[selector]({ preventDefault() { prevented = true; }, currentTarget: { values } });
  assert.ok(prevented);
  const url = new URL(assigned);
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/918129422113');
  return url.searchParams.get('text');
}
let message = send('[data-quick-form]', { service: 'Taxi services', destination: 'Kollam & Kochi / airport' });
assert.ok(message.includes('Kollam & Kochi / airport'));
assert.ok(message.includes('Taxi services'));
message = send('[data-enquiry-form]', { name: 'Test Traveller', service: 'Flight tickets', plans: 'Kochi → Dubai\n2 people & luggage?' });
assert.ok(message.includes('Test Traveller'));
assert.ok(message.includes('Kochi → Dubai\n2 people & luggage?'));
assert.ok(message.includes('Flight tickets'));
console.log('PASS: Both forms produce correctly encoded WhatsApp enquiries with the correct business number.');
