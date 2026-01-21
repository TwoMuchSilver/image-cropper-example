// src/components/CssGridTest/GridTestEditorModal.tsx
import React, { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { type GridSlotData } from '../../types';

interface EditorModalProps {
  slotData: GridSlotData;
  aspectRatio: number;
  onSave: (updatedSlot: GridSlotData) => void;
  onCancel: () => void;
}

export const GridTestEditorModal: React.FC<EditorModalProps> = ({
  slotData,
  aspectRatio,
  onSave,
  onCancel
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(slotData.imageSrc);
  const [crop, setCrop] = useState(slotData.crop);
  const [zoom, setZoom] = useState(slotData.zoom);
  const [croppedArea, setCroppedArea] = useState<Area | null>(
    slotData.croppedArea || null
  );
  // croppedAreaPixels도 저장하긴 하지만 CSS 렌더링엔 사용 안 함
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
    slotData.croppedAreaPixels || null
  );

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
        // 이미지 변경 시 크롭 초기화
        setZoom(1);
        setCrop({ x: 0, y: 0 });
      };
    }
  };

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedArea);
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = () => {
    if (imageSrc && croppedArea) {
      onSave({
        ...slotData,
        imageSrc,
        crop,
        zoom,
        croppedArea,       // 핵심: CSS 렌더링용 퍼센트 좌표
        croppedAreaPixels: croppedAreaPixels ?? undefined  // 필요시 사용
      });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }} onClick={onCancel}>
      <div style={{
        width: '90%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '90vh'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>이미지 편집 (Test Mode)</h3>
          <button onClick={onCancel} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          {!imageSrc ? (
            <div style={{ padding: '40px', textAlign: 'center', border: '2px dashed #ddd', borderRadius: '8px' }}>
              <input type="file" accept="image/*" onChange={onFileChange} />
            </div>
          ) : (
            <>
              <div style={{ position: 'relative', height: '300px', background: '#333' }}>
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  style={{
                    containerStyle: { background: '#222' },
                    cropAreaStyle: { border: '2px solid rgba(255, 255, 255, 0.5)' }
                  }}
                />
              </div>
              <div style={{ marginTop: '16px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label>Zoom: {zoom.toFixed(1)}x</label>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    style={{ width: '100%', marginTop: '8px' }}
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                </div>
                <input type="file" accept="image/*" onChange={onFileChange} />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onCancel} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}>취소</button>
          <button 
            onClick={handleSave} 
            disabled={!imageSrc}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '6px', 
              border: 'none', 
              background: imageSrc ? '#007AFF' : '#ccc', 
              color: 'white',
              cursor: imageSrc ? 'pointer' : 'not-allowed'
            }}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
