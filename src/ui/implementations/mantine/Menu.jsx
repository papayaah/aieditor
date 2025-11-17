import { Menu as MantineMenu } from '@mantine/core';

export const Menu = ({ trigger, children, open, onOpenChange }) => {
  return (
    <MantineMenu opened={open} onChange={onOpenChange}>
      <MantineMenu.Target>
        {trigger}
      </MantineMenu.Target>
      <MantineMenu.Dropdown>
        {children}
      </MantineMenu.Dropdown>
    </MantineMenu>
  );
};

export const MenuItem = ({ children, onClick, icon, variant = 'default', className = '' }) => {
  return (
    <MantineMenu.Item
      onClick={onClick}
      leftSection={icon}
      className={className}
      color={variant === 'danger' ? 'red' : variant === 'warning' ? 'yellow' : undefined}
    >
      {children}
    </MantineMenu.Item>
  );
};
