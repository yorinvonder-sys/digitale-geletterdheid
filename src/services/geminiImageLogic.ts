export const GEMINI_IMAGE_MODELS = [
  'gemini-3.1-flash-image-preview',
  'gemini-2.5-flash-image',
] as const;

export type GeminiImageModel = typeof GEMINI_IMAGE_MODELS[number];
export type ImageGenerationStyle = 'book' | 'branding' | 'general';
export type ImageAspectRatio = '1:1' | '3:2' | '2:3' | '3:4' | '4:3' | '4:5' | '5:4' | '9:16' | '16:9' | '21:9';

export interface GenerateImageResponse {
  imageBase64?: string;
  mimeType?: string;
  model?: string;
  error?: string;
  reason?: string;
}

export interface GeminiImageExtraction {
  imageBase64?: string;
  mimeType?: string;
  partCount: number;
}

const IMAGE_STYLE_PREFIXES: Record<ImageGenerationStyle, string> = {
  book: 'Kindvriendelijke illustratie in prentenboekstijl. ',
  branding: 'Professionele, moderne illustratie. ',
  general: 'Educatieve, kindvriendelijke illustratie. ',
};

const IMAGE_ASPECT_RATIO_LABELS: Record<ImageAspectRatio, string> = {
  '1:1': 'Vierkante afbeelding.',
  '3:2': 'Liggende afbeelding in 3:2 verhouding.',
  '2:3': 'Staande afbeelding in 2:3 verhouding.',
  '3:4': 'Staande afbeelding in 3:4 verhouding.',
  '4:3': 'Liggende afbeelding in 4:3 verhouding.',
  '4:5': 'Staande afbeelding in 4:5 verhouding.',
  '5:4': 'Liggende afbeelding in 5:4 verhouding.',
  '9:16': 'Verticale afbeelding in 9:16 verhouding.',
  '16:9': 'Breedbeeld afbeelding in 16:9 verhouding.',
  '21:9': 'Cinematische brede afbeelding in 21:9 verhouding.',
};

export const buildImagePrompt = (
  prompt: string,
  style: ImageGenerationStyle,
  aspectRatio: ImageAspectRatio,
): string => {
  return [
    'VEILIG VOOR KINDEREN. Geen geweld, geen seksuele content, geen angstaanjagende beelden.',
    IMAGE_STYLE_PREFIXES[style],
    prompt,
    IMAGE_ASPECT_RATIO_LABELS[aspectRatio],
    'Geen tekst of watermerk in de afbeelding.',
  ].join(' ').replace(/\s+/g, ' ').trim();
};

export const buildGeminiImageRequest = (
  prompt: string,
  style: ImageGenerationStyle,
  aspectRatio: ImageAspectRatio,
) => ({
  contents: [{
    role: 'user',
    parts: [{ text: buildImagePrompt(prompt, style, aspectRatio) }],
  }],
  generationConfig: {
    responseModalities: ['TEXT', 'IMAGE'],
    temperature: 0.4,
    maxOutputTokens: 2048,
  },
});

export const extractInlineImage = (payload: unknown): GeminiImageExtraction => {
  const parts = (payload as any)?.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    const inlineData = part?.inlineData || part?.inline_data;
    if (inlineData?.data) {
      return {
        imageBase64: inlineData.data,
        mimeType: inlineData.mimeType || inlineData.mime_type || 'image/png',
        partCount: parts.length,
      };
    }
  }
  return { partCount: parts.length };
};

export const isGeneratedImageDataUrl = (value: unknown): value is string => {
  return typeof value === 'string' && /^data:image\/(?:png|jpe?g|webp);base64,/i.test(value);
};
