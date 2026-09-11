import * as React from 'react';

import {
  ResourceFormFrame,
  type ResourceFormFrameProps,
} from '@/components/resource-form/ResourceFormFrame';

type ResourceFormOverlayProps = ResourceFormFrameProps & {
  renderContainer: (content: React.ReactNode) => React.ReactNode;
};

function ResourceFormOverlay({ renderContainer, ...frameProps }: ResourceFormOverlayProps) {
  return renderContainer(<ResourceFormFrame {...frameProps} />);
}

export { ResourceFormOverlay };
export type { ResourceFormOverlayProps };
