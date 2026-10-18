import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { InstallPrompt } from './InstallPrompt';

describe('InstallPrompt', () => {
  it('only renders after the browser provides an install event', async () => {
    const prompt = vi.fn().mockResolvedValue(undefined);
    const installEvent = Object.assign(new Event('beforeinstallprompt'), {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });

    render(<InstallPrompt />);
    expect(
      screen.queryByRole('button', { name: '安装应用' }),
    ).not.toBeInTheDocument();

    fireEvent(window, installEvent);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '安装应用' }));
      await installEvent.userChoice;
    });

    expect(prompt).toHaveBeenCalledOnce();
  });
});
