// src/components/GridEditor/EditorModal.tsx
import React, { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { type GridSlotData } from '../../types';
import './EditorModal.css';

interface EditorModalProps {
  slotData: GridSlotData;
  aspectRatio: number;
  onSave: (updatedSlot: GridSlotData) => void;
  onCancel: () => void;
}

export const EditorModal: React.FC<EditorModalProps> = ({
  slotData,
  aspectRatio,
  onSave,
  onCancel
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(slotData.imageSrc);
  const [crop, setCrop] = useState(slotData.crop);
  const [zoom, setZoom] = useState(slotData.zoom);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
    slotData.croppedAreaPixels || null
  );

  // 파일 업로드 핸들러
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result as string);
      };
    }
  };

  // 크롭 영역 계산 완료 시 호출
  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 저장 버튼 클릭
  const handleSave = () => {
    if (imageSrc && croppedAreaPixels) {
      onSave({
        ...slotData,
        imageSrc,
        crop,
        zoom,
        croppedAreaPixels
      });
    }
  };

  return (
    <div className="editor-modal-overlay" onClick={onCancel}>
      <div className="editor-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>이미지 편집</h3>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        {!imageSrc && (
          <div className="upload-zone">
            <p>이미지를 선택하세요</p>
            <label className="upload-btn">
              사진 선택
              <input type="file" accept="image/*" onChange={onFileChange} hidden />
            </label>
          </div>
        )}

        {imageSrc && (
          <>
            <div className="cropper-area">
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
                  cropAreaStyle: { border: '2px solid #fff' }
                }}
              />
            </div>

            <div className="modal-controls">
              <div className="zoom-control">
                <span>Zoom</span>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </div>

              <div className="change-image">
                <label className="change-btn">
                  다른 이미지 선택
                  <input type="file" accept="image/*" onChange={onFileChange} hidden />
                </label>
              </div>
            </div>
          </>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onCancel}>취소</button>
          <button 
            className="btn-save" 
            onClick={handleSave}
            disabled={!imageSrc || !croppedAreaPixels}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
