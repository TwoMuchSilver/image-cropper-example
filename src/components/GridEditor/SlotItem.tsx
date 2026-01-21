// src/components/GridEditor/SlotItem.tsx
import React from 'react';
import { type GridSlotData, type GridSlotConfig } from '../../types';
import './SlotItem.css';

interface SlotItemProps {
  slotConfig: GridSlotConfig;
  slotData: GridSlotData;
  onClick: () => void;
}

export const SlotItem: React.FC<SlotItemProps> = ({
  slotConfig,
  slotData,
  onClick
}) => {
  return (
    <div
      className="slot-item"
      style={{ gridArea: slotConfig.gridArea }}
      onClick={onClick}
    >
      {slotData.imageSrc ? (
        <div className="slot-image-container">
          <div
            className="slot-image"
            style={{
              backgroundImage: `url(${slotData.imageSrc})`,
              backgroundPosition: `${slotData.crop.x}% ${slotData.crop.y}%`,
              backgroundSize: `${slotData.zoom * 100}%`,
            }}
          />
          <div className="slot-edit-overlay">
            <span>편집</span>
          </div>
        </div>
      ) : (
        <div className="slot-placeholder">
          <span className="plus-icon">+</span>
          <span>사진 추가</span>
        </div>
      )}
    </div>
  );
};
