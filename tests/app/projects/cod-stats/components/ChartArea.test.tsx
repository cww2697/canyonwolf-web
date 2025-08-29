import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ChartArea from '../../../../../src/app/projects/cod-stats/components/ChartArea';
import type { TransformedRow } from '@/app/projects/cod-stats/components/types';
import {describe, test, expect } from "vitest";

function makeRow(utc: string, skill: string | number, kdRatio: number, kills = 0, deaths = 0): TransformedRow {
  return {
    utc,
    kills,
    deaths,
    skill: String(skill),
    kdRatio
  };
}

describe('ChartArea component', () => {
  test('renders series points for finite values and skips NaN', () => {
    const data: TransformedRow[] = [
      makeRow('2024-01-01T00:00:00Z', '1200', 1.5),
      makeRow('2024-01-02T00:00:00Z', 'N/A', 2.0),
      makeRow('2024-01-03T00:00:00Z', '1300', NaN)
    ];

    const { container } = render(<ChartArea data={data} />);

    const skillPoints = container.querySelectorAll('circle[fill="#3b82f6"]');
    const kdPoints = container.querySelectorAll('circle[fill="#10b981"]');

    expect(skillPoints.length).toBe(3);
    expect(kdPoints.length).toBe(2);
  });

  test('shows tooltip on hover with UTC timestamp', () => {
    const data: TransformedRow[] = [
      makeRow('2024-02-01T12:00:00Z', '1000', 1.1),
      makeRow('2024-02-02T12:00:00Z', '1100', 1.2)
    ];

    const { container } = render(<ChartArea data={data} />);

    const overlay = container.querySelector('rect[fill="transparent"]') as SVGRectElement;
    expect(overlay).toBeTruthy();

    fireEvent.mouseMove(overlay, { clientX: 500, clientY: 0 });

    expect(screen.getByText(/2024-02-0[12]T12:00:00Z/)).toBeInTheDocument();
  });

  test('renders em-dash placeholders in stats when no finite values', () => {
    const data: TransformedRow[] = [
      makeRow('2024-03-01T00:00:00Z', 'e', NaN),
      makeRow('2024-03-02T00:00:00Z', 'e', NaN)
    ];

    render(<ChartArea data={data} />);

    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(6);
  });
});