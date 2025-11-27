import React, { useState } from 'react';
import type { PresentationData, Slide } from '../types';
import { ChevronLeft, ChevronRight, Download, Monitor, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PPTPreviewProps {
    data: PresentationData;
    onDownload: () => void;
    onClose: () => void;
}

export const PPTPreview: React.FC<PPTPreviewProps> = ({ data, onDownload, onClose }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    // Construct the full slide deck for preview including Title, Agenda, Content, Summary, Q&A, Thank You
    const slides: Array<{ type: string; data?: any }> = [
        { type: 'TITLE', data: { title: data.title, subtitle: data.subtitle } },
        { type: 'AGENDA', data: { outline: data.outline } },
        ...data.outline.map(slide => ({ type: 'CONTENT', data: slide })),
        { type: 'SUMMARY', data: { outcomes: data.metadata.learningOutcomes } },
        { type: 'QA' },
        { type: 'THANK_YOU' }
    ];

    const currentSlide = slides[currentSlideIndex];
    const totalSlides = slides.length;

    const nextSlide = () => {
        if (currentSlideIndex < totalSlides - 1) setCurrentSlideIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) setCurrentSlideIndex(prev => prev - 1);
    };

    // Render different slide types
    const renderSlideContent = () => {
        const titleStyle = data.template?.titleBackground
            ? {
                backgroundImage: `url(${data.template.titleBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }
            : undefined;

        const contentStyle = data.template?.contentBackground
            ? {
                backgroundImage: `url(${data.template.contentBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }
            : { backgroundColor: 'white' };

        switch (currentSlide.type) {
            case 'TITLE':
                return (
                    <div
                        className={`h-full flex flex-col justify-center p-16 relative overflow-hidden ${!data.template?.titleBackground ? 'bg-gradient-to-br from-secondary to-blue-900 text-white' : 'text-slate-900'}`}
                        style={titleStyle}
                    >
                        {!data.template?.titleBackground && (
                            <div className="absolute top-0 left-0 w-full h-full bg-primary opacity-10 mix-blend-overlay"></div>
                        )}
                        <h1 className={`text-5xl font-bold mb-6 relative z-10 ${data.template?.titleBackground ? 'text-slate-900 bg-white/80 p-4 rounded-lg inline-block' : ''}`}>{currentSlide.data.title}</h1>
                        <h2 className={`text-2xl relative z-10 ${data.template?.titleBackground ? 'text-slate-800 bg-white/80 p-2 rounded-lg inline-block' : 'text-accent'}`}>{currentSlide.data.subtitle}</h2>
                        {!data.template?.titleBackground && (
                            <div className="absolute bottom-12 left-16 font-bold tracking-widest opacity-80">CLEVIO CODER CAMP</div>
                        )}
                    </div>
                );
            case 'AGENDA':
                return (
                    <div className="h-full p-12 flex flex-col" style={contentStyle}>
                        <h2 className="text-4xl font-bold text-secondary mb-8 bg-white/50 p-2 rounded-lg inline-block">Agenda</h2>
                        <ul className="space-y-4 text-xl text-slate-700 list-disc pl-8 bg-white/50 p-4 rounded-lg">
                            {currentSlide.data.outline.map((s: Slide) => (
                                <li key={s.slideNumber}>{s.title}</li>
                            ))}
                        </ul>
                        <Footer slideNumber={currentSlideIndex + 1} />
                    </div>
                );
            case 'CONTENT':
                const slideData = currentSlide.data as Slide;
                return (
                    <div className="h-full p-12 flex flex-col relative" style={contentStyle}>
                        <h2 className="text-3xl font-bold text-secondary mb-8 bg-white/50 p-2 rounded-lg inline-block">{slideData.title}</h2>
                        <div className="flex-grow overflow-y-auto bg-white/50 p-4 rounded-lg">
                            <ul className="space-y-3 text-lg text-slate-700 list-disc pl-6 mb-6">
                                {slideData.content.map((point, idx) => (
                                    <li key={idx}>{point}</li>
                                ))}
                            </ul>
                            {slideData.codeSnippet && (
                                <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 font-mono text-sm overflow-x-auto">
                                    <pre><code>{slideData.codeSnippet.code}</code></pre>
                                </div>
                            )}
                        </div>
                        {slideData.notes && (
                            <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 italic bg-white/50 p-2 rounded-lg">
                                Notes: {slideData.notes}
                            </div>
                        )}
                        <Footer slideNumber={currentSlideIndex + 1} />
                    </div>
                );
            case 'SUMMARY':
                return (
                    <div className="h-full p-12 flex flex-col" style={contentStyle}>
                        <h2 className="text-4xl font-bold text-secondary mb-8 bg-white/50 p-2 rounded-lg inline-block">Key Takeaways</h2>
                        <ul className="space-y-4 text-xl text-slate-700 list-disc pl-8 bg-white/50 p-4 rounded-lg">
                            {currentSlide.data.outcomes.map((outcome: string, idx: number) => (
                                <li key={idx}>{outcome}</li>
                            ))}
                        </ul>
                        <Footer slideNumber={currentSlideIndex + 1} />
                    </div>
                );
            case 'QA':
                return (
                    <div className="h-full flex flex-col justify-center items-center bg-secondary text-white">
                        <h1 className="text-6xl font-bold">Q & A</h1>
                    </div>
                );
            case 'THANK_YOU':
                return (
                    <div className="h-full flex flex-col justify-center items-center bg-primary text-white">
                        <h1 className="text-5xl font-bold mb-4">Thank You!</h1>
                        <p className="text-2xl">Clevio Coder Camp</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const Footer = ({ slideNumber }: { slideNumber: number }) => (
        <div className="absolute bottom-0 left-0 w-full h-12 bg-secondary flex items-center justify-between px-8 text-white text-sm">
            <span>Clevio Coder Camp</span>
            <span>{slideNumber}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-surface border border-primary/20 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/20 rounded-br-xl pointer-events-none"></div>

                {/* Toolbar */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-surface/50 backdrop-blur-sm">
                    <div className="flex items-center space-x-4">
                        <Monitor className="w-5 h-5 text-primary animate-pulse" />
                        <h3 className="font-display font-semibold text-white tracking-wider">PREVIEW MODE</h3>
                        <span className="text-primary/30 text-sm">|</span>
                        <span className="text-primary/80 font-mono text-sm">SLIDE {currentSlideIndex + 1} / {totalSlides}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onDownload}
                            className="flex items-center px-4 py-2 bg-primary/10 border border-primary/50 text-primary rounded hover:bg-primary hover:text-background transition-all duration-300 text-sm font-medium group"
                        >
                            <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                            DOWNLOAD PPTX
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-accent/10 hover:text-accent rounded-full transition-colors text-text/50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow flex bg-black/20 p-8 overflow-hidden relative">

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        disabled={currentSlideIndex === 0}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-surface border border-primary/20 rounded-full shadow-lg hover:border-primary hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-30 disabled:cursor-not-allowed z-10 transition-all group"
                    >
                        <ChevronLeft className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={nextSlide}
                        disabled={currentSlideIndex === totalSlides - 1}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-surface border border-primary/20 rounded-full shadow-lg hover:border-primary hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-30 disabled:cursor-not-allowed z-10 transition-all group"
                    >
                        <ChevronRight className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Slide Viewport */}
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="aspect-video w-full max-h-full bg-white shadow-2xl rounded-lg overflow-hidden relative ring-1 ring-white/10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlideIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.3, ease: "circOut" }}
                                    className="w-full h-full"
                                >
                                    {renderSlideContent()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 bg-surface">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                        style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
