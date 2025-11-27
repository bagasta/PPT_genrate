import type { LessonInput } from '../types';

export const validateLessonInput = (input: LessonInput): { isValid: boolean; errors: Partial<Record<keyof LessonInput, string>> } => {
    const errors: Partial<Record<keyof LessonInput, string>> = {};
    let isValid = true;

    if (!input.title || input.title.length < 5) {
        errors.title = 'Judul harus diisi (minimal 5 karakter)';
        isValid = false;
    }

    if (!input.description || input.description.length < 20) {
        errors.description = 'Deskripsi harus diisi (minimal 20 karakter)';
        isValid = false;
    }

    if (!input.category) {
        errors.category = 'Kategori harus dipilih';
        isValid = false;
    }

    if (!input.level) {
        errors.level = 'Level harus dipilih';
        isValid = false;
    }

    if (input.targetSlides < 1 || input.targetSlides > 50) {
        errors.targetSlides = 'Jumlah slide harus antara 1 dan 50';
        isValid = false;
    }

    return { isValid, errors };
};
