export interface LessonInput {
    title: string;
    description: string;
    category: 'Game Development' | 'Web Development' | 'Mobile App Development';
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    targetSlides: number;
}

export interface Slide {
    slideNumber: number;
    title: string;
    content: string[];
    notes?: string;
    codeSnippet?: {
        language: string;
        code: string;
    };
    imageUrl?: string;
}

export interface TemplateOptions {
    titleBackground?: string; // Data URL
    contentBackground?: string; // Data URL
}

export interface PresentationData {
    title: string;
    subtitle: string;
    outline: Slide[];
    metadata: {
        totalSlides: number;
        estimatedDuration: string;
        prerequisites: string[];
        learningOutcomes: string[];
    };
    template?: TemplateOptions;
}

export interface GenerationStatus {
    status: 'idle' | 'generating' | 'success' | 'error';
    message?: string;
    progress?: number;
}
