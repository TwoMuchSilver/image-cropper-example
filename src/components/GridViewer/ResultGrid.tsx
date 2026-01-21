// src/components/GridViewer/ResultGrid.tsx
import React from 'react';
import { type GridSlotData, type Template } from '../../types';
import { getCroppedImg } from '../../canvasUtils';
import './ResultGrid.css';

interface ResultGridProps {
  template: Template;
  slotsData: GridSlotData[];
  onImageClick: (index: number) => void;
}

export const ResultGrid: React.FC<ResultGridProps> = ({
  template,
  slotsData,
  onImageClick
}) => {
  const [croppedImages, setCroppedImages] = React.useState<(string | null)[]>([]);

  // 모든 슬롯의 크롭된 이미지를 생성
  React.useEffect(() => {
    const generateCroppedImages = async () => {
      const images = await Promise.all(
        slotsData.map(async (slotData) => {
          if (slotData.imageSrc && slotData.croppedAreaPixels) {
            try {
              return await getCroppedImg(slotData.imageSrc, slotData.croppedAreaPixels);
            } catch (error) {
              console.error('크롭 이미지 생성 실패:', error);
              return null;
            }
          }
          return null;
        })
      );
      setCroppedImages(images);
    };

    generateCroppedImages();
  }, [slotsData]);

  return (
    <div
      className="result-grid"
      style={{
        gridTemplateAreas: template.cssGridTemplate,
        gridTemplateColumns: template.cssGridColumns,
        gridTemplateRows: template.cssGridRows,
      }}
    >
      {template.slots.map((slotConfig, index) => {
        const croppedImage = croppedImages[index];
        
        return (
          <div
            key={slotConfig.id}
            className="result-slot"
            style={{ gridArea: slotConfig.gridArea }}
            onClick={() => croppedImage && onImageClick(index)}
          >
            {croppedImage ? (
              <img 
                src={croppedImage} 
                alt={`Slot ${slotConfig.id}`}
                className="result-image"
              />
            ) : (
              <div className="result-placeholder">
                <span>이미지 없음</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
