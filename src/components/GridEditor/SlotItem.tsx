// src/components/GridEditor/SlotItem.tsx
import React, { useState, useEffect } from 'react';
import { type GridSlotData, type GridSlotConfig } from '../../types';
import { getCroppedImg } from '../../canvasUtils';
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
  const { imageSrc, croppedAreaPixels } = slotData;
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  // Canvas를 사용하여 크롭된 이미지 생성 (롤백)
  useEffect(() => {
    const generateCroppedImage = async () => {
      if (imageSrc && croppedAreaPixels) {
        try {
          const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
          setCroppedImageUrl(croppedImage);
        } catch (e) {
          console.error(e);
          setCroppedImageUrl(imageSrc); // 실패 시 원본
        }
      } else {
        setCroppedImageUrl(imageSrc);
      }
    };
    generateCroppedImage();
  }, [imageSrc, croppedAreaPixels]);

  return (
    <div
      className="slot-item"
      style={{ 
        gridArea: slotConfig.gridArea,
        aspectRatio: `${slotConfig.ratio}`,
        height: 'auto'
      }}
      onClick={onClick}
    >
      {imageSrc ? (
        <div className="slot-image-container">
          <img
            src={croppedImageUrl || imageSrc || ''}
            alt="Slot"
            className="slot-image"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' // Canvas로 이미 잘린 이미지를 꽉 채움
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
