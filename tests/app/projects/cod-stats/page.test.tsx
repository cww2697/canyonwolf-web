import React from 'react';
import {render, screen} from '@testing-library/react';
import CodStatsPage from '../../../../src/app/projects/cod-stats/page';
import {describe, expect, test} from "vitest";

// JSDOM polyfills for TextEncoder/Decoder if missing
{
  const g = globalThis as { TextEncoder?: typeof TextEncoder; TextDecoder?: typeof TextDecoder };
  if (!g.TextEncoder) {
      g.TextEncoder = class {
        encode(str: string) {
            return new Uint8Array(Array.from(str).map(c => c.charCodeAt(0)));
        }
    } as unknown as typeof TextEncoder;
  }
  if (!g.TextDecoder) {
      g.TextDecoder = class {
        decode(u8: Uint8Array) {
            return String.fromCharCode(...u8);
        }
    } as unknown as typeof TextDecoder;
  }
}

describe('COD Stats page', () => {
  test('renders heading and CSV input with Submit/Clear buttons', () => {
    const { container } = render(<CodStatsPage />);

    expect(screen.getByRole('heading', { level: 1, name: /call of duty statistics visualizer/i })).toBeInTheDocument();

    // CSV input present (by id)
    expect(container.querySelector('#cod-csv')).toBeTruthy();

    // Submit and Clear controls
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });
});
