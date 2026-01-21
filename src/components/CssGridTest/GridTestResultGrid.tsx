// src/components/CssGridTest/GridTestResultGrid.tsx
import React from 'react';
import { type GridSlotData, type Template } from '../../types';

interface ResultGridProps {
  template: Template;
  slotsData: GridSlotData[];
  onImageClick: (index: number) => void;
}

export const GridTestResultGrid: React.FC<ResultGridProps> = ({
  template,
  slotsData,
  onImageClick
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateAreas: template.cssGridTemplate,
        gridTemplateColumns: template.cssGridColumns,
        gridTemplateRows: template.cssGridRows,
        gap: '4px', // 시각적 구분을 위해 간격 추가 (선택사항)
        width: '100%',
        alignItems: 'start' // aspect-ratio 왜곡 방지
      }}
    >
      {template.slots.map((slotConfig, index) => {
        const slotData = slotsData[index];
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
            key={slotConfig.id}
            style={{ 
              gridArea: slotConfig.gridArea,
              aspectRatio: `${slotConfig.ratio}`,
              position: 'relative',
              overflow: 'hidden',
              height: 'auto'
            }}
            onClick={() => imageSrc && onImageClick(index)}
          >
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt={`Slot ${slotConfig.id}`}
                style={imageStyle}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ color: '#aaa', fontSize: '12px' }}>Empty</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
