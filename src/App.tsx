// src/App.tsx
import { useState } from 'react';
import { TEMPLATES } from './templates';
import { type Template, type GridSlotData } from './types';
import { EditorModal } from './components/GridEditor/EditorModal';
import { SlotItem } from './components/GridEditor/SlotItem';
import { ResultGrid } from './components/GridViewer/ResultGrid';
import { GalleryModal } from './components/GridViewer/GalleryModal';
import { CssGridTestApp } from './CssGridTestApp'; // 새로 만든 테스트 앱
import './App.css';

type AppMode = 'template-select' | 'editor' | 'viewer';

// 기존 App 컴포넌트 (Canvas 기반 롤백됨)
const OriginalApp = () => {
  const [mode, setMode] = useState<AppMode>('template-select');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [slotsData, setSlotsData] = useState<GridSlotData[]>([]);
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
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

  const handleSlotClick = (index: number) => {
    setEditingSlotIndex(index);
  };

  const handleSlotSave = (updatedSlot: GridSlotData) => {
    if (editingSlotIndex !== null) {
      const newSlotsData = [...slotsData];
      newSlotsData[editingSlotIndex] = updatedSlot;
      setSlotsData(newSlotsData);
      setEditingSlotIndex(null);
    }
  };

  const handleModalCancel = () => {
    setEditingSlotIndex(null);
  };

  const handlePreview = () => {
    setMode('viewer');
  };

  const handleBackToEdit = () => {
    setMode('editor');
  };

  const handleReset = () => {
    setMode('template-select');
    setSelectedTemplate(null);
    setSlotsData([]);
  };

  const handleImageClick = (index: number) => {
    setGalleryIndex(index);
  };

  const handleGalleryClose = () => {
    setGalleryIndex(null);
  };

  const allSlotsFilled = slotsData.every((slot) => slot.imageSrc !== null);

  return (
    <div className="container">
      {mode === 'template-select' && (
        <div className="template-select-section">
          <h1>그리드 레이아웃 선택 (Canvas 방식)</h1>
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

      {editingSlotIndex !== null && selectedTemplate && (
        <EditorModal
          slotData={slotsData[editingSlotIndex]}
          aspectRatio={selectedTemplate.slots[editingSlotIndex].ratio}
          onSave={handleSlotSave}
          onCancel={handleModalCancel}
        />
      )}

      {galleryIndex !== null && (
        <GalleryModal
          images={slotsData.map((slot) => 
            slot.imageSrc // Canvas 방식은 원본을 보여주거나, 필요 시 crop된 이미지를 보여줄 수 있음
          )}
          currentIndex={galleryIndex}
          isOpen={true}
          onClose={handleGalleryClose}
        />
      )}
    </div>
  );
};

// 메인 래퍼 컴포넌트
const App = () => {
  // 기본값을 false(기존 버전)로 할지 true(새 버전)로 할지 결정
  // 사용자가 "새롭게 만들어보자"고 했으므로 새 버전을 기본으로 보여주는 게 좋을 수도 있지만,
  // 롤백도 요청했으므로 토글을 제공합니다.
  const [useTestMode, setUseTestMode] = useState(true);

  return (
    <div>
      <div style={{
        padding: '12px',
        background: '#222',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        position: 'sticky',
        top: 0,
        zIndex: 9999
      }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
          <input 
            type="radio" 
            name="mode" 
            checked={!useTestMode} 
            onChange={() => setUseTestMode(false)} 
          />
          Original (Canvas Rollback)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
          <input 
            type="radio" 
            name="mode" 
            checked={useTestMode} 
            onChange={() => setUseTestMode(true)} 
          />
          <span style={{ color: '#4da6ff', fontWeight: 'bold' }}>New CSS Grid Test</span>
        </label>
      </div>

      <div style={{ padding: '20px' }}>
        {useTestMode ? <CssGridTestApp /> : <OriginalApp />}
      </div>
    </div>
  );
};

export default App;
