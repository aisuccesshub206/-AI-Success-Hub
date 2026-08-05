import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  ArrowLeft,
  Download,
  Loader2,
  Copy,
  Check,
  Image as ImageIcon,
  Layers,
} from 'lucide-react';

import { UserProfile } from '../../types';
import { aiService } from '../../services/aiService';

interface AiImageStudioProps {
  user?: UserProfile;
  onBack: () => void;
  onLogFileProcess: (fileName: string, originalSize: number, processedSize: number, toolUsed: string) => void;
  onIncrementAiUsage?: () => void;
  onTriggerUsageLimit?: (reason: 'ai_daily' | 'ai_monthly') => void;
}

export const AiImageStudio: React.FC<AiImageStudioProps> = ({
  user,
  onBack,
  onLogFileProcess,
  onIncrementAiUsage,
  onTriggerUsageLimit,
}) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [generating, setGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const styles = [
    'Photorealistic',
    'Modern 3D SaaS Render',
    'Cinematic Lighting',
    'Minimalist Vector Art',
    'Cyberpunk Futuristic',
    'YouTube Viral Thumbnail',
  ];

  const aspectRatios = [
    { label: 'Square (1:1)', value: '1:1' },
    { label: 'Landscape (16:9)', value: '16:9' },
    { label: 'Portrait (9:16)', value: '9:16' },
    { label: 'Standard (4:3)', value: '4:3' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    // Check client-side plan limit
    if (user && user.usage && user.usage.aiRequestsToday >= user.usage.aiRequestsLimitDaily) {
      if (onTriggerUsageLimit) onTriggerUsageLimit('ai_daily');
      alert(`⚠️ You have reached your daily AI image limit (${user.usage.aiRequestsToday}/${user.usage.aiRequestsLimitDaily}) for your ${user.plan} plan. Please upgrade to Pro or Enterprise for higher limits!`);
      return;
    }

    setGenerating(true);
    setGeneratedImageUrl(null);

    try {
      const response = await aiService.generateImage({
        user,
        prompt,
        aspectRatio,
        style,
      });

      if (!response.success) {
        if (response.reason === 'ai_daily' || response.reason === 'ai_monthly') {
          if (onTriggerUsageLimit) onTriggerUsageLimit(response.reason);
        }
        alert(`⚠️ ${response.error || 'Failed to generate image.'}`);
        return;
      }

      if (response.data?.imageUrl) {
        setGeneratedImageUrl(response.data.imageUrl);
        setCaption(response.data.caption || '');
        onLogFileProcess(`generated_art_${Date.now()}.png`, prompt.length, 1024 * 500, 'AI Image Generator');
        if (onIncrementAiUsage) onIncrementAiUsage();
      } else {
        alert('Failed to generate image.');
      }
    } catch (err: any) {
      console.error('Image Gen Error:', err);
      alert(`Failed to generate image: ${err.message || 'Server error'}`);
    } finally {
      setGenerating(false);
    }
  };

  const copyImageLink = () => {
    if (!generatedImageUrl) return;
    navigator.clipboard.writeText(generatedImageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Tools</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Image & Thumbnail Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by Google Gemini 3.1 Flash Image. High-res visual generation from prompts.
            </p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 tracking-wider mb-1.5">
              Describe the image or thumbnail you want to generate:
            </label>
            <textarea
              rows={3}
              placeholder="e.g. A sleek futuristic dashboard UI floating over a glass desk, neon indigo lighting, high detail"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Artistic Style
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left truncate transition-colors ${
                      style === s
                        ? 'bg-pink-600 text-white border-pink-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {aspectRatios.map((ar) => (
                  <button
                    key={ar.value}
                    onClick={() => setAspectRatio(ar.value)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-left transition-colors ${
                      aspectRatio === ar.value
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {ar.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate CTA Button */}
        <button
          onClick={handleGenerate}
          disabled={generating || !prompt.trim()}
          className="w-full py-3.5 px-6 font-bold text-sm text-white bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 rounded-2xl shadow-lg shadow-pink-600/20 transition-all flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating AI Image...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Generate Image</span>
            </>
          )}
        </button>

        {/* Generated Image Result Display */}
        {generatedImageUrl && (
          <div className="mt-8 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Generated Visual Result:
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyImageLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Data!' : 'Copy Image'}</span>
                </button>

                <a
                  href={generatedImageUrl}
                  download={`ai_art_${Date.now()}.png`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </a>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center max-h-[500px]">
              <img
                src={generatedImageUrl}
                alt={prompt}
                className="max-h-[480px] w-auto object-contain mx-auto"
              />
            </div>

            {caption && (
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center italic">
                "{caption}"
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
