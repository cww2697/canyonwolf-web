import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../../src/app/layout';
import {describe, test, expect, vi } from "vitest";

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'geist-sans' }),
  Geist_Mono: () => ({ variable: 'geist-mono' })
}));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mock('next/link', () => ({ __esModule: true, default: ({ href, children, ...rest }: any) => <a href={href as string} {...rest}>{children}</a> }));

function renderBodyChildren(children: React.ReactNode) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tree = (RootLayout as any)({ children }) as React.ReactElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodyEl = (tree.props as any).children as React.ReactElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inner = (bodyEl.props as any).children as React.ReactNode;
  return render(<>{inner}</>, { baseElement: document.body });
}

describe('RootLayout', () => {
  test('renders top navigation and wraps children', () => {
    renderBodyChildren(<div data-testid="content">Hello</div>);

    // From TopNav contents
    expect(screen.getByRole('link', { name: /canyon wolf/i })).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
