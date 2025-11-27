import PptxGenJS from 'pptxgenjs';
import type { PresentationData, Slide } from '../types';

export const createPPT = async (data: PresentationData) => {
    const pptx = new PptxGenJS();

    // Layout
    pptx.layout = 'LAYOUT_16x9';

    // Define Colors
    const colors = {
        primary: 'FF6B35',
        secondary: '004E89',
        accent: 'F7B801',
        text: '333333',
        lightGray: 'F5F5F5',
        white: 'FFFFFF'
    };

    // Define Master Slide
    const masterBackground = data.template?.contentBackground
        ? { data: data.template.contentBackground }
        : { color: colors.white };

    pptx.defineSlideMaster({
        title: 'MASTER_SLIDE',
        background: masterBackground,
        objects: [
            // Header Bar (optional, maybe just a line)
            { rect: { x: 0, y: 0, w: '100%', h: 0.1, fill: { color: colors.primary } } },
            // Footer
            { rect: { x: 0, y: '95%', w: '100%', h: '5%', fill: { color: colors.secondary } } },
            { text: { text: 'Clevio Coder Camp', options: { x: 0.5, y: '96%', fontSize: 10, color: colors.white } } }
        ],
        slideNumber: { x: '95%', y: '96%', fontSize: 10, color: colors.white }
    });

    // 1. Title Slide
    const slide1 = pptx.addSlide();

    if (data.template?.titleBackground) {
        slide1.background = { data: data.template.titleBackground };
    } else {
        // Background Gradient-ish effect using shapes
        slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { type: 'solid', color: colors.secondary } });
        slide1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { type: 'solid', color: colors.primary, transparency: 80 } });
    }

    // Title
    slide1.addText(data.title, {
        x: 1, y: '40%', w: '80%', h: 1.5,
        fontSize: 44, bold: true,
        color: data.template?.titleBackground ? colors.text : colors.white,
        align: 'left', fontFace: 'Arial',
        fill: data.template?.titleBackground ? { color: colors.white, transparency: 20 } : undefined
    });

    // Subtitle
    slide1.addText(data.subtitle, {
        x: 1, y: '55%', w: '80%', h: 1,
        fontSize: 24,
        color: data.template?.titleBackground ? colors.text : colors.accent,
        align: 'left', fontFace: 'Arial',
        fill: data.template?.titleBackground ? { color: colors.white, transparency: 20 } : undefined
    });

    // Logo Placeholder
    if (!data.template?.titleBackground) {
        slide1.addText("CLEVIO CODER CAMP", {
            x: 0.5, y: 0.5, w: 3, h: 0.5,
            fontSize: 14, bold: true, color: colors.white,
            align: 'left'
        });
    }


    // 2. Agenda / Outline
    const slide2 = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    slide2.addText("Agenda", {
        x: 0.5, y: 0.5, fontSize: 32, bold: true, color: colors.secondary,
        fill: data.template?.contentBackground ? { color: colors.white, transparency: 50 } : undefined
    });

    const outlineItems = data.outline.map(s => s.title);
    slide2.addText(outlineItems.join('\n'), {
        x: 0.5, y: 1.5, w: '90%', h: '70%',
        fontSize: 18, color: colors.text, bullet: true, lineSpacing: 30,
        fill: data.template?.contentBackground ? { color: colors.white, transparency: 50 } : undefined
    });

    // 3. Content Slides
    data.outline.forEach((slideData: Slide) => {
        const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });

        // Slide Title
        slide.addText(slideData.title, {
            x: 0.5, y: 0.5, w: '90%', h: 0.8,
            fontSize: 32, bold: true, color: colors.secondary,
            fill: data.template?.contentBackground ? { color: colors.white, transparency: 50 } : undefined
        });

        // Content Bullet Points
        // Calculate height based on content length to leave room for code/images
        const contentHeight = slideData.codeSnippet ? 3 : 5;

        slide.addText(slideData.content.join('\n'), {
            x: 0.5, y: 1.5, w: '90%', h: contentHeight,
            fontSize: 20, color: colors.text, bullet: true, lineSpacing: 28, valign: 'top',
            fill: data.template?.contentBackground ? { color: colors.white, transparency: 50 } : undefined
        });

        // Code Snippet
        if (slideData.codeSnippet) {
            slide.addShape(pptx.ShapeType.rect, {
                x: 0.5, y: 4.5, w: '90%', h: 2.5,
                fill: { color: colors.lightGray }
            });

            slide.addText(slideData.codeSnippet.code, {
                x: 0.6, y: 4.6, w: '88%', h: 2.3,
                fontSize: 12, color: '333333', fontFace: 'Courier New',
                valign: 'top'
            });
        }

        // Notes
        if (slideData.notes) {
            slide.addNotes(slideData.notes);
        }
    });

    // 4. Summary Slide
    const summarySlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    summarySlide.addText("Key Takeaways", {
        x: 0.5, y: 0.5, fontSize: 32, bold: true, color: colors.secondary,
        fill: data.template?.contentBackground ? { color: colors.white, transparency: 50 } : undefined
    });

    const outcomes = data.metadata.learningOutcomes || [];
    summarySlide.addText(outcomes.join('\n'), {
        x: 0.5, y: 1.5, w: '90%', h: '70%',
        fontSize: 20, color: colors.text, bullet: true, lineSpacing: 30,
        fill: data.template?.contentBackground ? { color: colors.white, transparency: 50 } : undefined
    });

    // 5. Q&A Slide
    const qaSlide = pptx.addSlide();
    qaSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { type: 'solid', color: colors.secondary } });
    qaSlide.addText("Q & A", {
        x: 0, y: '40%', w: '100%', h: 1.5,
        fontSize: 60, bold: true, color: colors.white, align: 'center'
    });

    // 6. Thank You Slide
    const thanksSlide = pptx.addSlide();
    thanksSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { type: 'solid', color: colors.primary } });
    thanksSlide.addText("Thank You!", {
        x: 0, y: '40%', w: '100%', h: 1.5,
        fontSize: 50, bold: true, color: colors.white, align: 'center'
    });
    thanksSlide.addText("Clevio Coder Camp", {
        x: 0, y: '60%', w: '100%', h: 1,
        fontSize: 24, color: colors.white, align: 'center'
    });

    // Save
    const fileName = `clevio-coder-camp-${data.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${new Date().toISOString().slice(0, 10)}.pptx`;

    await pptx.writeFile({ fileName });
};
