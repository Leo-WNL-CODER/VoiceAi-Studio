"use client";

interface UpgradeModalProps {
  show: boolean;
  onClose: () => void;
  feature: string;
}

export default function UpgradeModal({ show, onClose, feature }: UpgradeModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-2xl p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Upgrade Your Plan</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-muted hover:text-foreground hover:bg-surface-hover transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-5">
          <p className="text-sm text-primary font-medium">
            {feature} requires an upgrade
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {/* Free */}
          <div className="border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-1">Free</h3>
            <div className="mb-3">
              <span className="text-xl font-bold">$0</span>
              <span className="text-muted text-xs">/month</span>
            </div>
            <div className="space-y-1.5">
              {[
                "5 generations total",
                "6 AI voices",
                "English only",
                "500 char limit",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-xs text-muted">{item}</span>
                </div>
              ))}
              {[
                "Voice cloning",
                "MP3 download",
                "AI rewrite",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-muted/30 flex-shrink-0">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span className="text-xs text-muted/40 line-through">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 py-2 text-center text-xs text-muted border border-border rounded-lg">
              Current plan
            </div>
          </div>

          {/* Pro */}
          <div className="border-2 border-primary rounded-xl p-4 relative">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-primary text-white text-[10px] font-bold rounded-full">
              POPULAR
            </div>
            <h3 className="text-sm font-semibold mb-1">Pro</h3>
            <div className="mb-3">
              <span className="text-xl font-bold">$8</span>
              <span className="text-muted text-xs">/month</span>
            </div>
            <div className="space-y-1.5">
              {[
                "50 generations/day",
                "All 21 AI voices",
                "14 languages",
                "5,000 char limit",
                "1 voice clone",
                "MP3 download",
                "AI rewrite",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" className="flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-xs text-muted">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                alert("Stripe payment integration coming soon!");
                onClose();
              }}
              className="mt-3 w-full py-2 text-xs font-medium rounded-lg text-white bg-gradient-to-r from-primary to-pink-500 hover:from-primary-hover hover:to-pink-400 transition-all"
            >
              Upgrade to Pro
            </button>
          </div>

          {/* Business */}
          <div className="border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-1">Business</h3>
            <div className="mb-3">
              <span className="text-xl font-bold">$20</span>
              <span className="text-muted text-xs">/month</span>
            </div>
            <div className="space-y-1.5">
              {[
                "200 generations/day",
                "All 21 AI voices",
                "14 languages",
                "10,000 char limit",
                "5 voice clones",
                "MP3 download",
                "AI rewrite",
                "Priority support",
              ].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5" className="flex-shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-xs text-muted">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                alert("Stripe payment integration coming soon!");
                onClose();
              }}
              className="mt-3 w-full py-2 text-xs font-medium rounded-lg text-foreground bg-surface-hover border border-border hover:border-primary/30 transition-all"
            >
              Upgrade to Business
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
