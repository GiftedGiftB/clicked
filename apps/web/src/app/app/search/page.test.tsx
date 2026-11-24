/**
 * @vitest-environment jsdom
 */
import { cleanup, render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SearchPage from './page';

const { getMessageCountMock } = vi.hoisted(() => ({
  getMessageCountMock: vi.fn(),
}));

vi.mock('@/lib/search/db', () => ({
  getMessageCount: getMessageCountMock,
}));

vi.mock('@/components/search/MessageSearch', () => ({
  MessageSearch: () => <div data-testid="message-search" />,
}));

vi.mock('next/link', () => ({
  default: ({ children, ...props }: ComponentProps<'a'>) => <a {...props}>{children}</a>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('SearchPage', () => {
  it('shows the indexed message count after loading', async () => {
    getMessageCountMock.mockResolvedValue(3);

    render(<SearchPage />);

    expect(await screen.findByText('3 messages indexed on this device.')).toBeDefined();
    expect(getMessageCountMock).toHaveBeenCalledOnce();
  });
});
