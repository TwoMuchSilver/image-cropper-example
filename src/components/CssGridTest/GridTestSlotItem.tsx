// src/components/CssGridTest/GridTestSlotItem.tsx
import React from 'react';
import { type GridSlotData, type GridSlotConfig } from '../../types';

interface SlotItemProps {
  slotConfig: GridSlotConfig;
  slotData: GridSlotData;
  onClick: () => void;
}

export const GridTestSlotItem: React.FC<SlotItemProps> = ({
  slotConfig,
  slotData,
  onClick
}) => {
  const { imageSrc, croppedArea } = slotData;

  const imageStyle: React.CSSProperties = (imageSrc && croppedArea) ? {
    position: 'absolute',
    top: `${-(croppedArea.y / croppedArea.height) * 100}%`,
    left: `${-(croppedArea.x / croppedArea.width) * 100}%`,
    width: `${(100 / croppedArea.width) * 100}%`,
    height: `${(100 / croppedArea.height) * 100}%`,
    maxWidth: 'none',
    maxHeight: 'none',
  } : {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  return (
    <div
      style={{
        gridArea: slotConfig.gridArea,
        aspectRatio: `${slotConfig.ratio}`,
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #ddd',
        backgroundColor: '#f5f5f5',
        cursor: 'pointer'
      }}
      onClick={onClick}
    >
      {imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt="Slot"
            style={imageStyle}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: '4px 8px',
            fontSize: '12px'
          }}>
            편집
          </div>
        </>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#888'
        }}>
          <span style={{ fontSize: '24px' }}>+</span>
          <span>사진 추가</span>
        </div>
      )}
    </div>
  );
};
