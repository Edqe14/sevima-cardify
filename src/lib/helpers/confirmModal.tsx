import { modals } from '@mantine/modals';
import type { OpenConfirmModal } from '@mantine/modals/lib/context';

export const confirmWithModal = (options: OpenConfirmModal) => {
  return new Promise((resolve) => {
    modals.openConfirmModal({
      ...options,
      labels: { confirm: 'Confirm', cancel: 'Cancel', ...options.labels },
      onCancel: () => {
        resolve(false);
        options.onCancel?.();
      },
      onConfirm: () => {
        resolve(true);
        options.onConfirm?.();
      },
    });
  });
};
