/**
 * PostCreator Wrapper - Themeable Version for Storybook
 * 
 * This wraps the PostCreator and injects the themeable PostSettings
 * based on the uiTheme prop
 */

import { PostCreator as OriginalPostCreator } from './PostCreator';
import { PostSettings as PostSettingsThemeable } from './PostSettings.themeable';
import { Sidebar } from '../Sidebar';

export const PostCreator = ({ uiTheme = 'native', ...props }) => {
  // For now, just render the original PostCreator
  // The themeable PostSettings will be used via the Sidebar
  return <OriginalPostCreator {...props} uiTheme={uiTheme} />;
};
