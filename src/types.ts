// src/types.ts

/**
 * 그리드의 각 슬롯에 저장되는 데이터
 */
export interface GridSlotData {
  id: string;          // 슬롯 ID (예: 'slot-1')
  imageSrc: string | null;
  crop: { x: number; y: number };
  zoom: number;
  // CSS 렌더링을 위한 백분율 기반 크롭 영역
  croppedArea?: { x: number; y: number; width: number; height: number };
  // croppedAreaPixels는 필요 시 저장 (서버 전송용)
  croppedAreaPixels?: { x: number; y: number; width: number; height: number };
}

/**
 * 템플릿에 정의된 슬롯의 설정 정보
 */
export interface GridSlotConfig {
  id: string;
  ratio: number;       // 이 슬롯이 요구하는 비율 (예: 16/9)
  gridArea: string;    // CSS grid-area 이름
}

/**
 * 그리드 레이아웃 템플릿
 */
export interface Template {
  id: string;
  name: string;
  cssGridTemplate: string; // CSS grid-template-areas 정의 문자열
  cssGridColumns: string;  // CSS grid-template-columns 정의
  cssGridRows: string;     // CSS grid-template-rows 정의
  slots: GridSlotConfig[];
}
