import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OpenAIOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface OpenAIResponse {
  success: boolean;
  content?: string;
  error?: string;
}

/**
 * Send a prompt to OpenAI and get a completion
 * @param prompt - The prompt to send to OpenAI
 * @param options - Optional configuration for the API call
 * @returns Promise with the response content or error
 */
export const sendToOpenAI = async (
  prompt: string,
  options: OpenAIOptions = {},
): Promise<OpenAIResponse> => {
  // Validate API key
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      error: "OpenAI API key not configured",
    };
  }

  // Validate prompt
  if (!prompt || prompt.trim().length === 0) {
    return {
      success: false,
      error: "Prompt cannot be empty",
    };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano-2025-04-14",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: options.temperature || 0,
      max_tokens: options.maxTokens || 500,
      top_p: options.topP || 1,
      frequency_penalty: options.frequencyPenalty || 0,
      presence_penalty: options.presencePenalty || 0,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "No content received from OpenAI",
      };
    }

    return {
      success: true,
      content: content.trim().replace(/^["']|["']$/g, ""),
    };
  } catch (error: any) {
    console.error("OpenAI API Error:", error);

    return {
      success: false,
      error: error.message || "An error occurred with the OpenAI API",
    };
  }
};

/**
 * Generate improved copywriting for text content
 * @param text - The text to improve
 * @param style - Optional style instructions
 * @returns Promise with improved text
 */
export const improveCopywriting = async (
  text: string,
  customPrompt?: string,
  styleTags?: string[],
): Promise<OpenAIResponse> => {
  let prompt: string;

  if (customPrompt && customPrompt.trim()) {
    // Use custom prompt from site settings
    prompt = `${customPrompt.trim()}: "${text}". Return only the improved text without any explanations or quotes.`;
  } else {
    // Use default behavior with style tags
    const styleString =
      styleTags && styleTags.length > 0
        ? styleTags.join(", ")
        : "engaging, clear, and compelling";
    prompt = `Improve this text for better copywriting: "${text}". Make it more ${styleString} while keeping the same core message. Return only the improved text without any explanations or quotes.`;
  }

  return sendToOpenAI(prompt, {
    model: "gpt-4o",
    temperature: 0.3,
    maxTokens: 500,
  });
};

/**
 * Generate Tailwind CSS classes based on description
 * @param description - Description of what styling is needed
 * @param existing - Existing classes to exclude
 * @returns Promise with Tailwind classes
 */
export const generateTailwindClasses = async (
  description: string,
  existing: string = "",
): Promise<OpenAIResponse> => {
  const excludeText = existing ? `, exclude the following: ${existing}` : "";
  const prompt = `Using Tailwind CSS version 3, I need a list of class names, separated by a space, that would apply to this search term: "${description}"${excludeText}. You can also list things that may be related to it, but if there is nothing that's a good match just return no response, and don't return partials, and make sure it's an actual class name provided by Tailwind CSS, and if it's a class that has sizes, like space-x and I wasn't specific make sure you return it with all the sizes.`;

  return sendToOpenAI(prompt, {
    model: "gpt-4o",
    temperature: 0,
    maxTokens: 50,
  });
};

/**
 * Generate content based on a custom prompt
 * @param prompt - Custom prompt for content generation
 * @param options - Optional configuration
 * @returns Promise with generated content
 */
export const generateContent = async (
  prompt: string,
  options: OpenAIOptions = {},
): Promise<OpenAIResponse> => {
  return sendToOpenAI(prompt, {
    model: "gpt-4o",
    temperature: options.temperature || 0.7,
    maxTokens: options.maxTokens || 500,
    ...options,
  });
};
