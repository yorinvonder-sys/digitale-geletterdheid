/**
 * C2PA Content Credentials — EU AI Act Art. 50(2) Compliance
 *
 * Embeds machine-readable Content Credentials (C2PA manifest) into
 * AI-generated images before they are displayed or stored.
 *
 * Uses the browser-compatible `c2pa` library (ContentAuthenticity/c2pa-js).
 * This module is lazy-loaded only when image generation is active,
 * keeping it out of the main bundle.
 *
 * Deadline: EU AI Act Art. 50 enforcement — August 2026
 *
 * @see https://c2pa.org
 * @see https://opensource.contentauthenticity.org
 */

import { createImageProvenance, type AiProvenanceMetadata } from './aiContentMarker';

// ============================================================================
// TYPES
// ============================================================================

export interface C2paManifest {
    /** C2PA claim generator identifier */
    claimGenerator: string;
    /** Title / filename of the asset */
    title: string;
    /** ISO timestamp of creation */
    instanceId: string;
    /** The provenance metadata embedded */
    provenance: AiProvenanceMetadata;
    /** Whether C2PA binary embedding succeeded */
    embedded: boolean;
    /** Fallback: base64 manifest JSON when binary embedding unavailable */
    manifestJson?: string;
}

export interface WatermarkResult {
    /** The image data (with C2PA manifest if supported, otherwise original) */
    imageData: Blob | string;
    /** The manifest metadata */
    manifest: C2paManifest;
    /** Whether the image was modified with binary C2PA data */
    binaryEmbedded: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CLAIM_GENERATOR = 'DGSkills/2.0 c2pa-js/0.x';
const C2PA_AVAILABLE = typeof window !== 'undefined';

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Embed C2PA Content Credentials into an AI-generated image.
 *
 * Strategy (progressive enhancement):
 * 1. If c2pa-web SDK is available → binary embed manifest in image
 * 2. If not → attach JSON-LD metadata as sidecar (stored alongside image)
 *
 * Both paths produce a WatermarkResult with full provenance audit trail.
 *
 * @param imageBlob - The AI-generated image as a Blob
 * @param model - The AI model that generated the image
 * @param title - Descriptive title for the asset
 * @returns WatermarkResult with embedded or sidecar manifest
 */
export async function embedC2paCredentials(
    imageBlob: Blob,
    model: string = 'gemini',
    title: string = 'AI-generated image'
): Promise<WatermarkResult> {
    const provenance = createImageProvenance(model);
    const instanceId = crypto.randomUUID();

    const manifest: C2paManifest = {
        claimGenerator: CLAIM_GENERATOR,
        title,
        instanceId,
        provenance,
        embedded: false,
    };

    // Attempt binary C2PA embedding via c2pa-web SDK
    if (C2PA_AVAILABLE) {
        try {
            const result = await embedBinaryC2pa(imageBlob, manifest);
            if (result) {
                return result;
            }
        } catch (err) {
            console.warn('[C2PA] Binary embedding failed, falling back to sidecar:', err);
        }
    }

    // Fallback: JSON-LD sidecar manifest
    manifest.manifestJson = JSON.stringify({
        '@context': 'https://c2pa.org/statements/1',
        '@type': 'c2pa.claim',
        claimGenerator: CLAIM_GENERATOR,
        title,
        instanceId,
        assertions: [
            {
                label: 'c2pa.actions',
                data: {
                    actions: [{
                        action: 'c2pa.created',
                        softwareAgent: provenance.generator,
                        parameters: {
                            model: provenance.model,
                            type: 'ai_generated',
                        },
                    }],
                },
            },
            {
                label: 'stds.schema-org.CreativeWork',
                data: {
                    '@type': 'CreativeWork',
                    author: [{
                        '@type': 'Organization',
                        name: 'DGSkills AI Lab',
                    }],
                    dateCreated: provenance.timestamp,
                    description: provenance.disclaimer,
                },
            },
        ],
    }, null, 2);

    return {
        imageData: imageBlob,
        manifest,
        binaryEmbedded: false,
    };
}

/**
 * Verify C2PA Content Credentials on an image.
 * Returns the manifest if valid, null if no credentials found.
 */
export async function verifyC2paCredentials(
    imageBlob: Blob
): Promise<C2paManifest | null> {
    if (!C2PA_AVAILABLE) return null;

    try {
        // Dynamic import to keep c2pa out of main bundle
        const { createC2pa } = await import(
            /* webpackChunkName: "c2pa" */
            'c2pa'
        );
        const c2pa = await createC2pa();
        const result = await c2pa.read(imageBlob);

        if (result?.manifestStore?.activeManifest) {
            const active = result.manifestStore.activeManifest;
            return {
                claimGenerator: active.claimGenerator || 'unknown',
                title: active.title || 'unknown',
                instanceId: active.instanceID || 'unknown',
                provenance: createImageProvenance('verified'),
                embedded: true,
            };
        }
    } catch (err) {
        console.warn('[C2PA] Verification failed:', err);
    }

    return null;
}

// ============================================================================
// INTERNAL: Binary C2PA embedding
// ============================================================================

async function embedBinaryC2pa(
    imageBlob: Blob,
    manifest: C2paManifest
): Promise<WatermarkResult | null> {
    try {
        // Dynamic import — only loaded when actually watermarking
        const { createC2pa } = await import(
            /* webpackChunkName: "c2pa" */
            'c2pa'
        );
        const c2pa = await createC2pa();

        const { signedAsset } = await c2pa.sign({
            asset: {
                mimeType: imageBlob.type || 'image/png',
                buffer: await imageBlob.arrayBuffer(),
            },
            manifest: {
                claim_generator: manifest.claimGenerator,
                title: manifest.title,
                assertions: [
                    {
                        label: 'c2pa.actions',
                        data: {
                            actions: [{
                                action: 'c2pa.created',
                                softwareAgent: manifest.provenance.generator,
                            }],
                        },
                    },
                    {
                        label: 'stds.schema-org.CreativeWork',
                        data: {
                            '@type': 'CreativeWork',
                            author: [{
                                '@type': 'Organization',
                                name: 'DGSkills AI Lab',
                            }],
                            dateCreated: manifest.provenance.timestamp,
                        },
                    },
                ],
            },
        });

        manifest.embedded = true;

        return {
            imageData: new Blob([signedAsset], { type: imageBlob.type }),
            manifest,
            binaryEmbedded: true,
        };
    } catch {
        return null;
    }
}

// ============================================================================
// UTILITY: Create data URL with embedded credentials metadata
// ============================================================================

/**
 * For images that cannot have binary C2PA (e.g., SVG, canvas exports),
 * attach provenance as a data attribute on the wrapping element.
 *
 * @returns HTML data attributes string for the img element
 */
export function getProvenanceDataAttributes(
    model: string = 'gemini'
): Record<string, string> {
    const provenance = createImageProvenance(model);
    return {
        'data-ai-generated': 'true',
        'data-ai-generator': provenance.generator,
        'data-ai-model': provenance.model,
        'data-ai-timestamp': provenance.timestamp,
        'data-ai-disclaimer': provenance.disclaimer,
    };
}
