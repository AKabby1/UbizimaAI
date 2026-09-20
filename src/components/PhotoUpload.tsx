import { useRef } from "react";
import type { PhotoAnswer } from "../types/assessment";
import "./PhotoUpload.css";

interface PhotoUploadProps {
  photos: PhotoAnswer[];
  onChange: (photos: PhotoAnswer[]) => void;
}

export function PhotoUpload({ photos, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const readers = Array.from(fileList).map(
      (file) =>
        new Promise<PhotoAnswer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              name: file.name,
              dataUrl: reader.result as string,
            });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    const newPhotos = await Promise.all(readers);
    onChange([...photos, ...newPhotos]);
  };

  const removePhoto = (id: string) => {
    onChange(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="photo-upload">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="photo-upload__input"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        className="photo-upload__trigger"
        onClick={() => inputRef.current?.click()}
      >
        <CameraIcon />
        <span>
          {photos.length === 0 ? "Add a photo" : "Add another photo"}
        </span>
      </button>

      {photos.length > 0 && (
        <ul className="photo-upload__grid">
          {photos.map((photo) => (
            <li key={photo.id} className="photo-upload__item">
              <img src={photo.dataUrl} alt={`Uploaded: ${photo.name}`} />
              <button
                type="button"
                className="photo-upload__remove"
                aria-label={`Remove ${photo.name}`}
                onClick={() => removePhoto(photo.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="photo-upload__note">
        Photos stay on this device for now — nothing is uploaded anywhere.
      </p>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-2h7l1 2h2A1.5 1.5 0 0 1 20 8.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18V8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
