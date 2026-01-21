// src/CssGridTestApp.tsx
import React, { useState } from 'react';
import { TEMPLATES } from './templates';
import { type Template, type GridSlotData } from './types';
import { GridTestSlotItem } from './components/CssGridTest/GridTestSlotItem';
import { GridTestResultGrid } from './components/CssGridTest/GridTestResultGrid';
import { GridTestEditorModal } from './components/CssGridTest/GridTestEditorModal';

type AppMode = 'template-select' | 'editor' | 'viewer';

export const CssGridTestApp = () => {
  const [mode, setMode] = useState<AppMode>('template-select');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [slotsData, setSlotsData] = useState<GridSlotData[]>([]);
  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);

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

  const handleSlotSave = (updatedSlot: GridSlotData) => {
    if (editingSlotIndex !== null) {
      const newSlotsData = [...slotsData];
      newSlotsData[editingSlotIndex] = updatedSlot;
      setSlotsData(newSlotsData);
      setEditingSlotIndex(null);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ margin: 0, color: '#007AFF' }}>CSS Grid & Percentage Transform Test</h1>
        <p style={{ color: '#666' }}>Canvas를 사용하지 않고 순수 CSS로 크롭을 구현합니다.</p>
      </header>

      {/* 1. 템플릿 선택 */}
      {mode === 'template-select' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ 
                height: '100px', 
                background: '#f0f0f0', 
                marginBottom: '8px',
                display: 'grid',
                gridTemplateAreas: template.cssGridTemplate,
                gridTemplateColumns: template.cssGridColumns,
                gridTemplateRows: template.cssGridRows,
                gap: '2px',
                padding: '4px'
              }}>
                {template.slots.map(slot => (
                  <div key={slot.id} style={{ gridArea: slot.gridArea, background: '#ddd' }} />
                ))}
              </div>
              <strong style={{ display: 'block' }}>{template.name}</strong>
            </div>
          ))}
        </div>
      )}

      {/* 2. 에디터 모드 */}
      {mode === 'editor' && selectedTemplate && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>{selectedTemplate.name} 편집</h2>
            <div style={{ gap: '8px', display: 'flex' }}>
              <button onClick={() => setMode('template-select')}>템플릿 변경</button>
              <button 
                onClick={() => setMode('viewer')}
                style={{ background: '#007AFF', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
              >
                결과 보기
              </button>
            </div>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateAreas: selectedTemplate.cssGridTemplate,
            gridTemplateColumns: selectedTemplate.cssGridColumns,
            gridTemplateRows: selectedTemplate.cssGridRows,
            gap: '4px',
            border: '1px solid #ddd',
            padding: '4px'
          }}>
            {selectedTemplate.slots.map((slotConfig, index) => (
              <GridTestSlotItem
                key={slotConfig.id}
                slotConfig={slotConfig}
                slotData={slotsData[index]}
                onClick={() => setEditingSlotIndex(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. 뷰어 모드 */}
      {mode === 'viewer' && selectedTemplate && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>결과물 (CSS Only)</h2>
            <button onClick={() => setMode('editor')}>다시 편집</button>
          </div>

          <GridTestResultGrid
            template={selectedTemplate}
            slotsData={slotsData}
            onImageClick={(index) => alert(`${index}번 이미지 클릭됨 (Lightbox 연동 가능)`)}
          />
        </div>
      )}

      {/* 모달 */}
      {editingSlotIndex !== null && selectedTemplate && (
        <GridTestEditorModal
          slotData={slotsData[editingSlotIndex]}
          aspectRatio={selectedTemplate.slots[editingSlotIndex].ratio}
          onSave={handleSlotSave}
          onCancel={() => setEditingSlotIndex(null)}
        />
      )}
    </div>
  );
};
