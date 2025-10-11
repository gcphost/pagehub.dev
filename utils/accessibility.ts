/**
 * Extracts accessibility-related props from component props
 * and returns them as DOM attributes
 */
export const getAccessibilityProps = (props: any) => {
  const accessibilityProps: any = {};

  // ARIA Labels
  if (props.ariaLabel) accessibilityProps["aria-label"] = props.ariaLabel;
  if (props.ariaDescribedBy)
    accessibilityProps["aria-describedby"] = props.ariaDescribedBy;

  // ARIA States
  if (props.ariaExpanded !== undefined)
    accessibilityProps["aria-expanded"] = props.ariaExpanded;
  if (props.ariaSelected !== undefined)
    accessibilityProps["aria-selected"] = props.ariaSelected;
  if (props.ariaChecked !== undefined)
    accessibilityProps["aria-checked"] = props.ariaChecked;
  if (props.ariaPressed !== undefined)
    accessibilityProps["aria-pressed"] = props.ariaPressed;

  // ARIA Roles
  if (props.role) accessibilityProps.role = props.role;

  // Keyboard Navigation
  if (props.tabIndex !== undefined)
    accessibilityProps.tabIndex = props.tabIndex;
  if (props.ariaHidden !== undefined)
    accessibilityProps["aria-hidden"] = props.ariaHidden;

  // Live Regions
  if (props.ariaLive) accessibilityProps["aria-live"] = props.ariaLive;
  if (props.ariaAtomic !== undefined)
    accessibilityProps["aria-atomic"] = props.ariaAtomic;

  return accessibilityProps;
};

/**
 * Merges accessibility props with existing props, giving priority to accessibility props
 */
export const mergeAccessibilityProps = (
  existingProps: any,
  componentProps: any,
) => {
  const accessibilityProps = getAccessibilityProps(componentProps);

  return {
    ...existingProps,
    ...accessibilityProps,
  };
};

export default {
  getAccessibilityProps,
  mergeAccessibilityProps,
};
