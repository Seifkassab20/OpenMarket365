// Self-check for importer procurement rules. Run: node scripts/check-importer.mjs (Node 22.18+ strips TS types).
import assert from 'node:assert/strict';
import {
  applyAcceptance,
  recordReveal,
  RevealLimitError,
  REVEAL_DAILY_LIMIT,
  validateRfqDates,
  formatPrice,
} from '../src/lib/services/importerService.ts';

// FR-RFQ-005: winner ACCEPTED, same-RFQ rivals DECLINED, other RFQs untouched.
const q = (id, rfq_id) => ({ id, rfq_id, status: 'PENDING_REVIEW' });
const quotes = [q('a', 'r1'), q('b', 'r1'), q('c', 'r2')];
assert.deepEqual(
  applyAcceptance(quotes, quotes[0]).map((x) => x.status),
  ['ACCEPTED', 'DECLINED', 'PENDING_REVIEW']
);

// FR-SEC-001: repeat reveal is free, new day resets, limit blocks the 51st contact.
let ledger = recordReveal(null, 'a', '2026-09-23');
assert.equal(recordReveal(ledger, 'a', '2026-09-23').quoteIds.length, 1);
assert.equal(recordReveal({ date: '2026-09-22', quoteIds: ['x'] }, 'a', '2026-09-23').quoteIds.length, 1);
const full = { date: '2026-09-23', quoteIds: Array.from({ length: REVEAL_DAILY_LIMIT }, (_, i) => `q${i}`) };
assert.throws(() => recordReveal(full, 'new', '2026-09-23'), RevealLimitError);
assert.equal(recordReveal(full, 'q0', '2026-09-23'), full);

// FR-RFQ-001 timeline: deadline not past, delivery after deadline, window forward.
const today = '2026-09-23';
assert.equal(validateRfqDates('2026-10-01', '2026-10-10', '2026-10-20', today), null);
assert.ok(validateRfqDates('2026-09-01', '2026-10-10', '2026-10-20', today));
assert.ok(validateRfqDates('2026-10-10', '2026-10-10', '2026-10-20', today));
assert.ok(validateRfqDates('2026-10-01', '2026-10-20', '2026-10-10', today));
assert.ok(validateRfqDates('', '2026-10-10', '2026-10-20', today));

// FR-RFQ-003: USD and EUR both render.
assert.equal(formatPrice({ unit_price: 685, currency: 'USD' }), '$685');
assert.equal(formatPrice({ unit_price: 1980, currency: 'EUR' }), '€1,980');

console.log('importer checks passed');
