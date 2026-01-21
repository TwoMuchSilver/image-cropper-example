// src/App.tsx
import React, { useState } from 'react';
import { TEMPLATES } from './templates';
import { type Template, type GridSlotData } from './types';
import { EditorModal } from './components/GridEditor/EditorModal';
import { SlotItem } from './components/GridEditor/SlotItem';
import { ResultGrid } from './components/GridViewer/ResultGrid';
import { GalleryModal } from './components/GridViewer/GalleryModal';
import './App.css';

type AppMode = 'template-select' | 'editor' | 'viewer';

const App = () => {
  // 현재 모드
  const [mode, setMode] = useState<AppMode>('template-select');
  
  // 선택된 템플릿
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // 각 슬롯의 데이터
  const [slotsData, setSlotsData] = useState<GridSlotData[]>([]);
  
  // 편집 중인 슬롯 인덱스
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  
  // 갤러리 모달 상태
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  // 템플릿 선택 핸들러
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    // 템플릿의 슬롯 개수만큼 빈 데이터 초기화
    setSlotsData(
      template.slots.map((slot) => ({
        id: slot.id,
        imageSrc: null,
        crop: { x: 0, y: 0 },
        zoom: 1,
      }))
    );
    setMode('editor');
  };

  // 슬롯 클릭 핸들러 (편집 모달 열기)
  const handleSlotClick = (index: number) => {
    setEditingSlotIndex(index);
  };

  // 슬롯 데이터 저장 핸들러
  const handleSlotSave = (updatedSlot: GridSlotData) => {
    if (editingSlotIndex !== null) {
      const newSlotsData = [...slotsData];
      newSlotsData[editingSlotIndex] = updatedSlot;
      setSlotsData(newSlotsData);
      setEditingSlotIndex(null);
    }
  };

  // 편집 모달 닫기
  const handleModalCancel = () => {
    setEditingSlotIndex(null);
  };

  // 뷰어 모드로 전환
  const handlePreview = () => {
    setMode('viewer');
  };

  // 편집 모드로 돌아가기
  const handleBackToEdit = () => {
    setMode('editor');
  };

  // 템플릿 선택으로 돌아가기
  const handleReset = () => {
    setMode('template-select');
    setSelectedTemplate(null);
    setSlotsData([]);
  };

  // 갤러리 열기
  const handleImageClick = (index: number) => {
    setGalleryIndex(index);
  };

  // 갤러리 닫기
  const handleGalleryClose = () => {
    setGalleryIndex(null);
  };

  // 모든 슬롯에 이미지가 있는지 확인
  const allSlotsFilled = slotsData.every((slot) => slot.imageSrc !== null);

  return (
    <div className="container">
      {/* 1. 템플릿 선택 모드 */}
      {mode === 'template-select' && (
        <div className="template-select-section">
          <h1>그리드 레이아웃 선택</h1>
          <p>원하는 레이아웃을 선택하세요</p>
          <div className="template-grid">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => handleTemplateSelect(template)}
              >
                <div
                  className="template-preview"
                  style={{
                    display: 'grid',
                    gridTemplateAreas: template.cssGridTemplate,
                    gridTemplateColumns: template.cssGridColumns,
                    gridTemplateRows: template.cssGridRows,
                    gap: '4px',
                  }}
                >
                  {template.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="template-slot"
                      style={{ gridArea: slot.gridArea }}
                    />
                  ))}
                </div>
                <p className="template-name">{template.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. 편집 모드 */}
      {mode === 'editor' && selectedTemplate && (
        <div className="editor-section">
          <div className="editor-header">
            <div>
              <h2>{selectedTemplate.name}</h2>
              <p>각 칸을 클릭하여 이미지를 추가하세요</p>
            </div>
            <button className="btn-text" onClick={handleReset}>
              템플릿 변경
            </button>
          </div>

          <div
            className="editor-grid"
            style={{
              gridTemplateAreas: selectedTemplate.cssGridTemplate,
              gridTemplateColumns: selectedTemplate.cssGridColumns,
              gridTemplateRows: selectedTemplate.cssGridRows,
            }}
          >
            {selectedTemplate.slots.map((slotConfig, index) => (
              <SlotItem
                key={slotConfig.id}
                slotConfig={slotConfig}
                slotData={slotsData[index]}
                onClick={() => handleSlotClick(index)}
              />
            ))}
          </div>

          <div className="editor-actions">
            <button 
              className="btn-preview" 
              onClick={handlePreview}
              disabled={!allSlotsFilled}
            >
              미리보기
            </button>
          </div>
        </div>
      )}

      {/* 3. 뷰어 모드 */}
      {mode === 'viewer' && selectedTemplate && (
        <div className="viewer-section">
          <div className="viewer-header">
            <h2>완성된 그리드</h2>
            <div className="viewer-actions">
              <button className="btn-secondary" onClick={handleBackToEdit}>
                편집으로 돌아가기
              </button>
              <button className="btn-primary" onClick={handleReset}>
                새로 만들기
              </button>
            </div>
          </div>

          <ResultGrid
            template={selectedTemplate}
            slotsData={slotsData}
            onImageClick={handleImageClick}
          />
        </div>
      )}

      {/* 편집 모달 */}
      {editingSlotIndex !== null && selectedTemplate && (
        <EditorModal
          slotData={slotsData[editingSlotIndex]}
          aspectRatio={selectedTemplate.slots[editingSlotIndex].ratio}
          onSave={handleSlotSave}
          onCancel={handleModalCancel}
        />
      )}

      {/* 갤러리 모달 */}
      {galleryIndex !== null && (
        <GalleryModal
          images={slotsData.map((slot) => 
            slot.croppedAreaPixels && slot.imageSrc ? slot.imageSrc : null
          )}
          currentIndex={galleryIndex}
          isOpen={true}
          onClose={handleGalleryClose}
        />
      )}
    </div>
  );
};

export default App;
