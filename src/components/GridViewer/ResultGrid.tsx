// src/components/GridViewer/ResultGrid.tsx
import React, { useState, useEffect } from 'react';
import { type GridSlotData, type Template } from '../../types';
import { getCroppedImg } from '../../canvasUtils';
import './ResultGrid.css';

interface ResultGridProps {
  template: Template;
  slotsData: GridSlotData[];
  onImageClick: (index: number) => void;
}

const ResultSlotItem: React.FC<{
  slotData: GridSlotData;
  onClick: () => void;
  ratio: number;
}> = ({ slotData, onClick }) => {
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateCroppedImage = async () => {
      if (slotData.imageSrc && slotData.croppedAreaPixels) {
        try {
          const url = await getCroppedImg(slotData.imageSrc, slotData.croppedAreaPixels);
          setCroppedImageUrl(url);
        } catch (e) {
          console.error(e);
          setCroppedImageUrl(slotData.imageSrc);
        }
      } else {
        setCroppedImageUrl(slotData.imageSrc);
      }
    };
    generateCroppedImage();
  }, [slotData.imageSrc, slotData.croppedAreaPixels]);

  if (!slotData.imageSrc) {
    return (
      <div className="result-placeholder">
        <span>이미지 없음</span>
      </div>
    );
  }

  return (
    <img
      src={croppedImageUrl || slotData.imageSrc || ''}
      alt="Result Slot"
      className="result-image"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }}
      onClick={onClick}
    />
  );
};

export const ResultGrid: React.FC<ResultGridProps> = ({
  template,
  slotsData,
  onImageClick
}) => {
  return (
    <div
      className="result-grid"
      style={{
        gridTemplateAreas: template.cssGridTemplate,
        gridTemplateColumns: template.cssGridColumns,
        gridTemplateRows: template.cssGridRows,
        alignItems: 'start'
      }}
    >
      {template.slots.map((slotConfig, index) => {
        return (
          <div
            key={slotConfig.id}
            className="result-slot"
            style={{ 
              gridArea: slotConfig.gridArea,
              aspectRatio: `${slotConfig.ratio}`,
              height: 'auto',
              overflow: 'hidden'
            }}
          >
            <ResultSlotItem 
              slotData={slotsData[index]} 
              onClick={() => onImageClick(index)}
              ratio={slotConfig.ratio}
            />
          </div>
        );
      })}
    </div>
  );
};
