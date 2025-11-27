import axios from 'axios';
import type { LessonInput, PresentationData } from '../types';

const API_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

// Mock data for development when API is not available
const MOCK_DATA: PresentationData = {
    title: "Membuat Game Flappy Bird dengan Unity",
    subtitle: "Panduan Lengkap untuk Pemula",
    outline: [
        {
            slideNumber: 1,
            title: "Pengenalan Game Flappy Bird",
            content: [
                "Apa itu Flappy Bird?",
                "Kenapa belajar dengan Flappy Bird?",
                "Game mechanics yang akan dipelajari"
            ],
            notes: "Jelaskan konsep dasar game dan motivasi pembelajaran"
        },
        {
            slideNumber: 2,
            title: "Setup Unity Project",
            content: [
                "Install Unity Hub",
                "Membuat project 2D baru",
                "Struktur folder project"
            ],
            notes: "Demo instalasi dan setup project",
            codeSnippet: undefined
        },
        {
            slideNumber: 3,
            title: "Membuat Player (Bird)",
            content: [
                "Import sprite bird",
                "Menambahkan Rigidbody2D",
                "Script untuk kontrol jump"
            ],
            notes: "Hands-on session membuat karakter bird",
            codeSnippet: {
                language: "csharp",
                code: `using UnityEngine;

public class BirdController : MonoBehaviour
{
    public float jumpForce = 5f;
    private Rigidbody2D rb;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            rb.velocity = Vector2.up * jumpForce;
        }
    }
}`
            }
        }
    ],
    metadata: {
        totalSlides: 12,
        estimatedDuration: "90 minutes",
        prerequisites: ["Basic C# knowledge", "Unity installed"],
        learningOutcomes: [
            "Mampu membuat game 2D sederhana",
            "Memahami physics dalam Unity",
            "Memahami game loop dan input handling"
        ]
    }
};

export const generatePresentation = async (input: LessonInput): Promise<PresentationData> => {
    // If no API URL is configured, return mock data after a delay
    if (!API_URL) {
        console.warn('No VITE_N8N_WEBHOOK_URL configured, using mock data.');
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_DATA);
            }, 2000);
        });
    }

    try {
        const response = await axios.post(API_URL, {
            ...input,
            timestamp: new Date().toISOString(),
        }, {
            timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 300000, // Default 5 minutes
        });

        let responseData = response.data;
        console.log('Raw API Response:', JSON.stringify(responseData, null, 2));

        // Normalize: If array, take first item
        if (Array.isArray(responseData)) {
            if (responseData.length > 0) {
                responseData = responseData[0];
            } else {
                throw new Error('Empty array response from API');
            }
        }

        // Check if it has 'output' property containing the real JSON string
        // This handles both { output: "..." } and [{ output: "..." }] (after normalization)
        if (responseData && typeof responseData === 'object' && responseData.output) {
            try {
                let rawOutput = responseData.output;
                console.log('Found n8n output property. Content length:', rawOutput.length);

                // Clean markdown if it's a string
                if (typeof rawOutput === 'string') {
                    rawOutput = rawOutput.trim();
                    // Remove ```json, ```, or just ``` at start/end
                    rawOutput = rawOutput.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
                }

                // If it's already an object (n8n might have parsed it), use it. Otherwise parse string.
                if (typeof rawOutput === 'object') {
                    responseData = rawOutput;
                } else {
                    responseData = JSON.parse(rawOutput);
                }
                console.log('Parsed JSON from output string:', responseData);
            } catch (e) {
                console.error('Failed to parse n8n output string:', e);
                console.error('Raw output was:', responseData.output);
                throw new Error('Invalid response format from AI: Could not parse JSON');
            }
        }

        if (responseData.status === 'success' && responseData.data) {
            return responseData.data;
        } else {
            console.error('Validation failed. Status:', responseData.status, 'Data present:', !!responseData.data);
            throw new Error(responseData.message || 'Failed to generate presentation: Invalid data structure');
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
