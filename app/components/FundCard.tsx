import { Fund } from '@/app/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface FundCardProps {
  fund: Fund;
  onClick: () => void;
  isClickable?: boolean;
  showGlow?: boolean;
  showElo?: boolean;
}

export default function FundCard({ 
  fund, 
  onClick, 
  isClickable = true,
  showGlow = false,
  showElo = true
}: FundCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const stageColors = {
    early: 'bg-slate-100 text-slate-700 border-slate-200',
    multi: 'bg-slate-100 text-slate-700 border-slate-200',
    late: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <Card
      onClick={isClickable ? onClick : undefined}
      className={`
        w-full max-w-md
        transition-all duration-200
        ${isClickable ? 'hover:shadow-lg hover:border-slate-300 cursor-pointer' : 'opacity-60 cursor-not-allowed'}
        ${showGlow ? 'ring-2 ring-slate-900 shadow-xl border-slate-900' : 'border-gray-200'}
      `}
    >
      <CardHeader className="text-center pb-4 space-y-4">
        {/* Logo */}
        {fund.logo_url && !imageError ? (
          <img
            src={fund.logo_url}
            alt={`${fund.name} logo`}
            className="w-20 h-20 mx-auto object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-20 h-20 mx-auto bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
            <span className="text-3xl font-semibold text-slate-700">
              {fund.name.charAt(0)}
            </span>
          </div>
        )}

        <div className="space-y-2">
          <CardTitle className="text-2xl font-semibold text-slate-900">
            {fund.name}
          </CardTitle>
          
          {/* Stage Badge */}
          <div className="flex justify-center">
            <Badge variant="outline" className={stageColors[fund.stage]}>
              {fund.stage.charAt(0).toUpperCase() + fund.stage.slice(1)} Stage
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="text-center space-y-3">
        {/* ELO Score */}
        {showElo ? (
          <div className="py-2">
            <p className="text-sm text-slate-500 mb-1">ELO Rating</p>
            <p className="text-4xl font-bold text-slate-900">
              {fund.elo_score}
            </p>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center">
            <p className="text-sm text-slate-400">Vote to reveal rating</p>
          </div>
        )}

        {/* Match Count */}
        <p className="text-sm text-slate-500">
          {fund.match_count} {fund.match_count === 1 ? 'match' : 'matches'}
        </p>

        {/* Website Link */}
        <a
          href={fund.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          Visit Website <ExternalLink className="w-3 h-3" />
        </a>
      </CardContent>
    </Card>
  );
}