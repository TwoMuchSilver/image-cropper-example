// src/App.tsx
import React, { useState, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { getCroppedImg } from './canvasUtils';
import './App.css';

// 비율 옵션 정의
const aspectRatios = [
  { value: 1, label: '1:1', width: 40, height: 40 },
  { value: 4 / 5, label: '4:5', width: 32, height: 40 },
  { value: 16 / 9, label: '16:9', width: 40, height: 22.5 },
];

const App = () => {
  // 1. 상태 관리
  const [imageSrc, setImageSrc] = useState<string | null>(null); // 업로드된 이미지 소스
  const [crop, setCrop] = useState({ x: 0, y: 0 });              // 크롭 위치 (x, y)
  const [zoom, setZoom] = useState(1);                          // 확대 배율
  const [aspect, setAspect] = useState(4 / 5);                  // 크롭 비율
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null); // 자를 영역 좌표(px)
  const [croppedImage, setCroppedImage] = useState<string | null>(null); // 최종 결과물 이미지 URL

  // 2. 파일 업로드 핸들러
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

  // 3. 크롭 영역 계산 완료 시 호출 (사용자가 움직일 때마다 발생)
  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 4. 최종 결과물 만들기 버튼 클릭
  const handleSave = async () => {
    try {
      if (imageSrc && croppedAreaPixels) {
        const result = await getCroppedImg(imageSrc, croppedAreaPixels);
        setCroppedImage(result);
      }
    } catch (e) {
      console.error("이미지 생성 실패:", e);
    }
  };

  return (
    <div className="container">
      {/* 이미지 선택 전 */}
      {!imageSrc && (
        <div className="upload-section">
          <h2>사진 편집기</h2>
          <p>사진을 선택하여 편집을 시작하세요.</p>
          <label className="upload-label">
            사진 선택
            <input type="file" accept="image/*" onChange={onFileChange} hidden />
          </label>
        </div>
      )}

      {/* 이미지 선택 후 편집 중 */}
      {imageSrc && !croppedImage && (
        <div className="editor-section">
          <div className="cropper-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              // [UI 커스텀 포인트] 내부 스타일 수정
              style={{
                containerStyle: { background: '#222' },
                cropAreaStyle: { border: '2px solid #fff' } 
              }}
            />
          </div>

          {/* [UI 커스텀 포인트] 하단 컨트롤 바 */}
          <div className="controls">
            {/* 비율 선택 */}
            <div className="aspect-selector">
              <span>비율</span>
              <div className="aspect-buttons">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.label}
                    className={`aspect-btn ${aspect === ratio.value ? 'active' : ''}`}
                    onClick={() => setAspect(ratio.value)}
                  >
                    <div 
                      className="aspect-shape"
                      style={{
                        width: `${ratio.width}px`,
                        height: `${ratio.height}px`,
                      }}
                    />
                    <span className="aspect-label">{ratio.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="zoom-slider">
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
            <div className="button-group">
              <button className="btn-cancel" onClick={() => setImageSrc(null)}>취소</button>
              <button className="btn-save" onClick={handleSave}>편집 완료</button>
            </div>
          </div>
        </div>
      )}

      {/* 편집 완료 후 결과물 확인 */}
      {croppedImage && (
        <div className="result-section">
          <h2>편집 완료!</h2>
          <div className="result-preview">
            <img src={croppedImage} alt="Result" />
          </div>
          <button className="btn-save" onClick={() => setCroppedImage(null)}>다시 수정</button>
        </div>
      )}
    </div>
  );
};

export default App;