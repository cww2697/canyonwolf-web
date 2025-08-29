import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../src/app/page';
import {describe, test, expect, vi } from "vitest";

// Mock next/image to render a simple img in tests
vi.mock('next/image', () => ({ __esModule: true, default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        const {fill: _fill, priority: _priority, ...rest} = props as any;
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img {...rest} />;
}}));

describe('Home page', () => {
  test('renders main heading and github link', () => {
    render(<Home />);

    // Main heading
    expect(screen.getByRole('heading', { level: 1, name: /canyon wolf/i })).toBeInTheDocument();

    // Tagline text snippet
    expect(screen.getByText(/Software Developer & Gaming Enthusiast/i)).toBeInTheDocument();

    // GitHub link
    const link = screen.getByRole('link', { name: /view the full repository on github/i });
    expect(link).toHaveAttribute('href', 'https://github.com/cww2697/canyonwolf-web');
  });

  test('shows the portrait image', () => {
    render(<Home />);
    const img = screen.getByRole('img', { name: /canyon wolf/i });
    expect(img).toBeInTheDocument();
    // From src attribute in page
    expect(img).toHaveAttribute('src', '/canyon_wolf.PNG');
  });
});
