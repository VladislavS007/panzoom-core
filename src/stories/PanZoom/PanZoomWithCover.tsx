// eslint-disable-next-line import/no-extraneous-dependencies
import React, { forwardRef, MutableRefObject, useLayoutEffect } from 'react';

import { PanZoomApi, PanZoomOptions } from 'types';
import initPanZoom, { getAllowedProps } from '@/index';
import usePanZoom from './usePanZoom';

type PanZoomWithCoverOmit = Omit<PanZoomOptions, 'boundary'>

const omitFields = ['boundary'];
const panZoomWithCoverAllowedProps = getAllowedProps()
  .filter((propName) => !omitFields.includes(propName)) as Array<keyof PanZoomWithCoverOmit>;

type PanZoomWithCoverProps = {
  apiRef?: MutableRefObject<PanZoomApi>,
  cover: string,
  onCoverLoad?: () => void,
} & PanZoomWithCoverOmit

const PanZoomWithCover: React.FC<PanZoomWithCoverProps> = ({
  apiRef,
  children,
  cover,
  onCoverLoad,
  ...props
}) => {
  const {
    childRef, parentRef, panZoomRef, render, setInitialized,
  } = usePanZoom({
    apiRef,
    allowedProps: panZoomWithCoverAllowedProps,
    children,
    props,
  });

  useLayoutEffect(() => {
    setInitialized(false);

    const image = new Image();
    image.src = cover;
    image.onload = () => {
      const containerNode = parentRef.current.parentNode as HTMLElement;
      const containerSize = containerNode.getBoundingClientRect();

      const imageSize = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      };

      const scale = Math.max(
        containerSize.width / imageSize.width,
        containerSize.height / imageSize.height,
      );

      childRef.current.style.backgroundImage = `url('${cover}')`;

      panZoomRef.current = initPanZoom(
        childRef.current,
        {
          ...props,
          boundary: true,
          className: props.className || 'react-panzoom-with-cover',
          width: imageSize.width,
          height: imageSize.height,
          zoomInitial: scale,
          zoomMin: scale,
          zoomMax: props.zoomMax * scale,
        },
      );

      setInitialized(true);
      onCoverLoad();
    };

    return () => {
      if (!panZoomRef.current) return;
      panZoomRef.current.destroy();
      panZoomRef.current = null;
    };
  }, [cover]);

  return render;
};

const PanZoomWithCoverRef = forwardRef(
  (props: PanZoomWithCoverProps, ref: MutableRefObject<PanZoomApi>) => (
    <PanZoomWithCover {...props} apiRef={ref} />
  ),
) as React.FC<PanZoomWithCoverProps & { ref?: MutableRefObject<PanZoomApi> }>;

export default PanZoomWithCoverRef;
