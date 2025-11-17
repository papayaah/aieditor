import { Modal as MantineModal } from '@mantine/core';

export const Modal = ({ open, onClose, title, children, size = 'md' }) => {
  // Map our sizes to Mantine sizes
  const sizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  };

  return (
    <MantineModal
      opened={open}
      onClose={onClose}
      title={title}
      size={sizeMap[size]}
    >
      {children}
    </MantineModal>
  );
};
