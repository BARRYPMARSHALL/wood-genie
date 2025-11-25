import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Mail, Check } from 'lucide-react';

const SocialShare: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  const url = encodeURIComponent(window.location.href);
  const rawText = "I just turned a photo into detailed woodworking plans for free using Wood Genie! 🧞‍♂️🪚";
  const text = encodeURIComponent(rawText);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-slate-200 w-full">
      <div className="flex items-center gap-2 text-slate-400 text-sm font-medium uppercase tracking-wider">
        <Share2 className="w-4 h-4" /> Share this tool
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {/* Facebook */}
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        
        {/* Twitter / X */}
        <a 
          href={`https://twitter.com/intent/tweet?url=${url}&text=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
          aria-label="Share on X"
          title="Share on X"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>

        {/* WhatsApp */}
        <a 
          href={`https://wa.me/?text=${text}%20${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
        >
           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        </a>

        {/* Pinterest */}
        <a 
          href={`https://pinterest.com/pin/create/button/?url=${url}&description=${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-[#BD081C] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
          aria-label="Share on Pinterest"
          title="Share on Pinterest"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.399.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.173 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.62 0 12.017 0z"/></svg>
        </a>

        {/* Email */}
        <a 
           href={`mailto:?subject=Free%20Woodworking%20Plans&body=${text}%20${url}`}
           className="w-10 h-10 rounded-full bg-slate-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
           aria-label="Share via Email"
           title="Share via Email"
        >
           <Mail className="w-5 h-5" />
        </a>

        {/* Copy Link (for TikTok/Insta) */}
        <button 
           onClick={handleCopy}
           className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg ${copied ? 'bg-green-500 text-white scale-110' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
           aria-label="Copy Link"
           title="Copy Link (for TikTok/Instagram)"
        >
           {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
        </button>
      </div>
      
      {copied && (
        <div className="text-xs text-green-600 font-bold animate-in fade-in slide-in-from-bottom-1">
            Link copied! Paste it on TikTok/Instagram.
        </div>
      )}
    </div>
  );
};

export default SocialShare;