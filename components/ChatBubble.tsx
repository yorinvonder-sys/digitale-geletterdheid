
import React from 'react';
import { ChatMessage } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Sparkles, Download, CheckCircle2, Loader2, Info } from 'lucide-react';
import { CodeChangeCard } from './CodeChangeCard';

/**
 * Clean internal instruction text from messages before displaying to students.
 * Filters out technical tags and instruction text like:
 * - "INSTRUCTIE:" prefixed lines
 * - "[PAGE target=...]...[/PAGE]" tags
 * - "[TITLE]...[/TITLE]" tags  
 * - "[IMG target=...]...[/IMG]" tags
 * - "Antwoord alleen met de nieuwe..." instruction lines
 * - "Genereer GEEN/ALLEEN" instruction lines
 */
const cleanInstructionText = (text: string): string => {
  if (!text) return text;

  let cleaned = text;

  // Remove INSTRUCTIE: blocks (entire lines starting with INSTRUCTIE)
  cleaned = cleaned.replace(/INSTRUCTIE:[^\n]*(?:\n|$)/gi, '');

  // Remove "Gewenste aanpassing:" lines
  cleaned = cleaned.replace(/Gewenste aanpassing:[^\n]*(?:\n|$)/gi, '');

  // Remove "Antwoord alleen met de nieuwe" instruction lines
  cleaned = cleaned.replace(/Antwoord alleen met de nieuwe[^\n]*(?:\n|$)/gi, '');

  // Remove "Genereer GEEN/ALLEEN" instruction lines
  cleaned = cleaned.replace(/Genereer (GEEN|ALLEEN)[^\n]*(?:\n|$)/gi, '');

  // Remove "Verander NIETS" instruction lines
  cleaned = cleaned.replace(/Verander NIETS[^\n]*(?:\n|$)/gi, '');

  // Remove "Beschrijving voor" instruction lines
  cleaned = cleaned.replace(/Beschrijving voor[^\n]*(?:\n|$)/gi, '');

  // Remove "Nieuwe titel aanvraag:" lines  
  cleaned = cleaned.replace(/Nieuwe titel aanvraag:[^\n]*(?:\n|$)/gi, '');

  // Remove [PAGE target="X"]...[/PAGE] tags (keep content inside for model messages)
  cleaned = cleaned.replace(/\[PAGE target="?\d+"?\]/gi, '');
  cleaned = cleaned.replace(/\[\/PAGE\]/gi, '');

  // Remove [TITLE]...[/TITLE] tags
  cleaned = cleaned.replace(/\[TITLE\]/gi, '');
  cleaned = cleaned.replace(/\[\/TITLE\]/gi, '');

  // Remove [IMG target="X"]...[/IMG] tags
  cleaned = cleaned.replace(/\[IMG target="?[^"]*"?\][^\[]*\[\/IMG\]/gi, '');

  // Remove "Inhoud:" prefix lines
  cleaned = cleaned.replace(/^Inhoud:[^\n]*(?:\n|$)/gim, '');

  // Clean up excessive whitespace/newlines that remain
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
};

/**
 * Check if a message is purely an internal instruction (should be hidden entirely)
 */
const isInternalInstruction = (text: string): boolean => {
  if (!text) return false;

  // Check if message starts with INSTRUCTIE: and is mostly instruction content
  if (text.trim().startsWith('INSTRUCTIE:')) {
    // If after cleaning there's very little left, hide the whole message
    const cleaned = cleanInstructionText(text);
    return cleaned.length < 20;
  }

  return false;
};

interface ChatBubbleProps {
  message: ChatMessage;
  onLinkClick?: (url: string) => void;
  isLatest?: boolean;
  isBusy?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onLinkClick, isLatest = false, isBusy = false }) => {
  const isUser = message.role === 'user';

  // Clean the message text for display (removes internal instruction tags)
  const displayText = isUser ? cleanInstructionText(message.text) : message.text;

  // Hide messages that are purely internal instructions with no meaningful content
  if (isUser && isInternalInstruction(message.text)) {
    return null; // Don't render this message at all
  }

  // If cleaned text is empty, don't show the bubble
  if (isUser && !displayText.trim()) {
    return null;
  }

  // Use isBusy if provided for latest message, fallback to text-based heuristic for historical/standard messages
  const isGenerating = isLatest ? isBusy : (message.role === 'model' && (message.text.includes('...') || !message.text.endsWith('.')));


  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[90%] md:max-w-[80%] px-5 py-4 text-base leading-relaxed shadow-sm
          ${isUser
            ? 'bg-slate-900 text-white rounded-3xl rounded-br-lg'
            : 'bg-white text-slate-800 rounded-3xl rounded-bl-lg border border-slate-100 shadow-indigo-100/50'
          }
        `}
      >
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-lab-primary rounded-md flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-lab-primary">AI Mentor</span>
          </div>
        )}

        {/* Gegenereerde Afbeelding */}
        {message.image && (
          <div className="mb-4 relative group">
            <img
              src={message.image}
              alt="Gegenereerd door AI"
              className="rounded-2xl w-full h-auto shadow-md border-2 border-slate-100"
            />
            <a
              href={message.image}
              download="mijn-boek-plaatje.png"
              className="absolute top-3 right-3 bg-white/80 backdrop-blur p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              title="Download plaatje"
            >
              <Download size={16} className="text-slate-700" />
            </a>
          </div>
        )}

        <div className="prose prose-sm max-w-none prose-slate text-left">
          {isUser ? (
            <p className="whitespace-pre-wrap font-medium">{displayText}</p>
          ) : (
            <MarkdownRenderer
              components={{
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      onClick={(e) => {
                        if (onLinkClick && href) {
                          e.preventDefault();
                          onLinkClick(href);
                        }
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 underline decoration-indigo-300 underline-offset-2 font-bold transition-colors"
                    >
                      {children}
                    </a>
                  )
                },
                p({ children }) { return <p className="mb-2 last:mb-0 font-medium">{children}</p> },
                code(props) {
                  const { children, className, node } = props;
                  // Check of dit de volledige game code is (boilerplate)
                  const content = String(children);
                  const isFullGameCode = content.includes('<!DOCTYPE html>') || content.length > 500;

                  // Als het inline is (dus in de zin zelf), render normaal
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !content.includes('\n');

                  if (isInline) {
                    return (
                      <code className={`bg-amber-50 text-amber-700 rounded px-1.5 py-0.5 font-bold font-mono text-sm border border-amber-100 ${className || ''}`}>
                        {children}
                      </code>
                    )
                  }

                  // Als het een groot blok code is, verberg het achter een badge
                  if (isFullGameCode) {
                    const isProcessing = isGenerating;
                    return (
                      <div className={`my-4 p-3 ${isProcessing ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'} border rounded-xl flex items-center justify-between gap-3 shadow-sm transition-all duration-500`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 ${isProcessing ? 'bg-amber-100' : 'bg-emerald-100'} rounded-lg transition-colors`}>
                            {isProcessing ? (
                              <Loader2 size={20} className="animate-spin text-amber-600" />
                            ) : (
                              <CheckCircle2 size={20} />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm">
                              {isProcessing ? 'Code Schrijven...' : 'Game Code Bijgewerkt'}
                            </span>
                            <span className="text-xs opacity-80">
                              {isProcessing ? 'De AI is de code aan het aanpassen' : 'Kijk naar de preview rechts! 👉'}
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  }

                  // Anders, render het als een normaal code block (voor educatieve snippets)
                  return (
                    <div className="relative my-4 group">
                      <div className="absolute top-0 right-0 bg-slate-800 text-[10px] text-slate-400 px-3 py-1 rounded-bl-lg rounded-tr-xl font-mono">CODE LES</div>
                      <pre className="bg-slate-900 text-indigo-100 p-5 pt-8 rounded-2xl overflow-x-auto text-xs md:text-sm shadow-inner custom-scrollbar border border-slate-700">
                        {children}
                      </pre>
                    </div>
                  )
                },
                ul({ children }) { return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul> },
                ol({ children }) { return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol> },
                strong({ children }) { return <strong className="text-slate-900 font-extrabold">{children}</strong> }
              }}
            >
              {message.text}
            </MarkdownRenderer>
          )}
        </div>

        {/* Show code changes for educational purposes */}
        {message.codeChanges && message.codeChanges.length > 0 && (
          <CodeChangeCard changes={message.codeChanges} />
        )}

        {/* AI Disclaimer (EU AI Act Transparency) */}
        {!isUser && (
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
            <Info size={10} className="shrink-0" />
            <span>Gegenereerd door AI. Controleer altijd de feiten.</span>
          </div>
        )}
      </div>
    </div>
  );
};
