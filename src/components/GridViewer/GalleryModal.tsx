// src/components/GridViewer/GalleryModal.tsx
import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface GalleryModalProps {
  images: (string | null)[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose
}) => {
  // null이 아닌 이미지만 필터링
  const validImages = images
    .map((src, index) => ({ src, originalIndex: index }))
    .filter((item) => item.src !== null);

  // 현재 인덱스를 필터링된 배열의 인덱스로 변환
  const lightboxIndex = validImages.findIndex(
    (item) => item.originalIndex === currentIndex
  );

  const slides = validImages.map((item) => ({
    src: item.src as string,
  }));

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={slides}
      index={lightboxIndex >= 0 ? lightboxIndex : 0}
    />
  );
};
