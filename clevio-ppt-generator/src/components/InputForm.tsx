import React, { useState } from 'react';
import type { LessonInput, TemplateOptions } from '../types';
import { validateLessonInput } from '../utils/validators';
import { BookOpen, Layers, Target, MonitorPlay, Image as ImageIcon, Upload } from 'lucide-react';

interface InputFormProps {
    onSubmit: (data: LessonInput, template?: TemplateOptions) => void;
    isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<LessonInput>({
        title: '',
        description: '',
        category: 'Game Development',
        level: 'Beginner',
        targetSlides: 12,
    });

    const [template, setTemplate] = useState<TemplateOptions>({});
    const [fileNames, setFileNames] = useState({ title: '', content: '' });

    const [errors, setErrors] = useState<Partial<Record<keyof LessonInput, string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'targetSlides' ? parseInt(value) || 0 : value,
        }));
        // Clear error when user types
        if (errors[name as keyof LessonInput]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'title' | 'content') => {
        const file = e.target.files?.[0];
        if (file) {
            setFileNames(prev => ({ ...prev, [type]: file.name }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setTemplate(prev => ({
                    ...prev,
                    [type === 'title' ? 'titleBackground' : 'contentBackground']: reader.result as string
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { isValid, errors: newErrors } = validateLessonInput(formData);

        if (isValid) {
            onSubmit(formData, template);
        } else {
            setErrors(newErrors);
        }
    };

    const inputClasses = `block w-full pl-10 pr-3 py-3 bg-surface/50 border border-primary/20 rounded-lg text-text placeholder-text/30 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 hover:border-primary/40`;
    const labelClasses = `block text-xs font-mono text-primary/80 mb-2 uppercase tracking-wider`;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-surface/30 backdrop-blur-xl p-8 md:p-10 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden group">
            {/* Decorative Corner Accents */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-2xl"></div>

            <div className="space-y-4">
                <label htmlFor="title" className={labelClasses}>
                    Mission Objective (Title)
                </label>
                <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-primary/50 group-focus-within/input:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={`${inputClasses} ${errors.title ? 'border-accent/50 focus:border-accent focus:ring-accent' : ''}`}
                        placeholder="Ex: Building a Neural Network with Python"
                    />
                </div>
                {errors.title && <p className="text-xs text-accent font-mono mt-1 flex items-center gap-1"><span className="inline-block w-1 h-1 bg-accent rounded-full"></span> {errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label htmlFor="category" className={labelClasses}>
                        Sector (Category)
                    </label>
                    <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Layers className="h-5 w-5 text-primary/50 group-focus-within/input:text-primary transition-colors" />
                        </div>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={inputClasses}
                        >
                            <option value="Game Development">Game Development</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Mobile App Development">Mobile App Development</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <label htmlFor="level" className={labelClasses}>
                        Difficulty Clearance
                    </label>
                    <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Target className="h-5 w-5 text-primary/50 group-focus-within/input:text-primary transition-colors" />
                        </div>
                        <select
                            id="level"
                            name="level"
                            value={formData.level}
                            onChange={handleChange}
                            disabled={isLoading}
                            className={inputClasses}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <label htmlFor="targetSlides" className={labelClasses}>
                    Output Quantity (Slides)
                </label>
                <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MonitorPlay className="h-5 w-5 text-primary/50 group-focus-within/input:text-primary transition-colors" />
                    </div>
                    <input
                        type="number"
                        id="targetSlides"
                        name="targetSlides"
                        min="1"
                        max="50"
                        value={formData.targetSlides}
                        onChange={handleChange}
                        disabled={isLoading}
                        className={inputClasses}
                    />
                </div>
                {errors.targetSlides && <p className="text-xs text-accent font-mono mt-1">{errors.targetSlides}</p>}
            </div>

            {/* Template Upload Section */}
            <div className="space-y-6 border-t border-white/5 pt-6">
                <h3 className="text-xs font-mono text-secondary mb-2 uppercase tracking-wider flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Custom Assets (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-text/50 uppercase tracking-widest">
                            Title Slide Background
                        </label>
                        <div className="relative group/file">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'title')}
                                disabled={isLoading}
                                className="hidden"
                                id="title-bg-upload"
                            />
                            <label
                                htmlFor="title-bg-upload"
                                className="flex items-center justify-center px-4 py-3 border border-dashed border-primary/30 rounded-lg text-sm font-medium text-text/70 hover:text-primary hover:border-primary hover:bg-primary/5 cursor-pointer transition-all duration-300"
                            >
                                <ImageIcon className="h-5 w-5 mr-2 text-primary/50 group-hover/file:text-primary transition-colors" />
                                <span className="truncate max-w-[150px]">{fileNames.title || 'Select Image...'}</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-text/50 uppercase tracking-widest">
                            Content Slide Background
                        </label>
                        <div className="relative group/file">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, 'content')}
                                disabled={isLoading}
                                className="hidden"
                                id="content-bg-upload"
                            />
                            <label
                                htmlFor="content-bg-upload"
                                className="flex items-center justify-center px-4 py-3 border border-dashed border-primary/30 rounded-lg text-sm font-medium text-text/70 hover:text-primary hover:border-primary hover:bg-primary/5 cursor-pointer transition-all duration-300"
                            >
                                <ImageIcon className="h-5 w-5 mr-2 text-primary/50 group-hover/file:text-primary transition-colors" />
                                <span className="truncate max-w-[150px]">{fileNames.content || 'Select Image...'}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <label htmlFor="description" className={labelClasses}>
                    Mission Brief (Description)
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`${inputClasses} resize-none`}
                    placeholder="Describe the learning objectives and key concepts..."
                />
                {errors.description && <p className="text-xs text-accent font-mono mt-1">{errors.description}</p>}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full relative group overflow-hidden py-4 px-6 rounded-lg font-display font-bold text-background tracking-widest uppercase transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]'}`}
            >
                <div className="absolute inset-0 bg-primary group-hover:bg-white transition-colors duration-300"></div>
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat transition-[background-position_0s] duration-0 group-hover:bg-[position:200%_0,0_0] group-hover:duration-[1500ms]"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? 'PROCESSING...' : 'INITIATE GENERATION'}
                </span>
            </button>
        </form>
    );
};
