import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AffiliationBadge } from './AffiliationVerification';

jest.mock('../Services/communityApi', () => ({
    affiliationOptions: [{ value: 'ujlp-current', label: 'Current UJLP member' }]
}));

test('self-reported claims never receive a verified badge', () => {
    for (const status of [undefined, 'pending', 'declined']) {
        const html = renderToStaticMarkup(<AffiliationBadge review={status ? { status, affiliation: 'ujlp-current' } : undefined} />);
        expect(html).not.toContain('· verified');
    }
    const html = renderToStaticMarkup(<AffiliationBadge review={{ status: 'verified', affiliation: 'ujlp-current' }} />);
    expect(html).toContain('Current UJLP member · verified');
});
