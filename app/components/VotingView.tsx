'use client';

import { useState, useEffect } from 'react';
import { Fund } from '@/app/lib/types';
import FundCard from './FundCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trophy, ArrowRight, Loader2 } from 'lucide-react';

export default function VotingView() {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [currentPair, setCurrentPair] = useState<[Fund, Fund] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedWinnerId, setSelectedWinnerId] = useState<number | null>(null);

  useEffect(() => {
    fetchFunds();
  }, []);

  const fetchFunds = async () => {
    try {
      const response = await fetch('/api/funds');
      const data = await response.json();
      setFunds(data);
      
      if (!currentPair) {
        setCurrentPair(getRandomPair(data));
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch funds:', error);
    }
  };

  const getRandomPair = (fundsList: Fund[]): [Fund, Fund] | null => {
    if (fundsList.length < 2) return null;
    
    const shuffled = [...fundsList].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
  };

  const updateCurrentPairScores = (fundsList: Fund[]) => {
    if (!currentPair) return;
    
    const updatedFund1 = fundsList.find(f => f.id === currentPair[0].id);
    const updatedFund2 = fundsList.find(f => f.id === currentPair[1].id);
    
    if (updatedFund1 && updatedFund2) {
      setCurrentPair([updatedFund1, updatedFund2]);
    }
  };

  const handleVote = async (winnerId: number, loserId: number) => {
    setIsVoting(true);
    setSelectedWinnerId(winnerId);

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ winnerId, loserId }),
      });

      if (response.ok) {
        const fundsResponse = await fetch('/api/funds');
        const updatedFunds = await fundsResponse.json();
        setFunds(updatedFunds);
        updateCurrentPairScores(updatedFunds);
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleNext = () => {
    const newPair = getRandomPair(funds);
    setCurrentPair(newPair);
    setHasVoted(false);
    setSelectedWinnerId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!currentPair) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl text-muted-foreground">Not enough funds to compare</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-bold text-slate-900">
            VC Fund Ranker
          </h1>
          <p className="text-lg text-slate-600">
            {hasVoted 
              ? 'Rankings updated! Click Next for another matchup.' 
              : 'Which VC fund is better? Click to vote.'}
          </p>
          
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/leaderboard">
              <Trophy className="w-4 h-4" />
              View Leaderboard
            </Link>
          </Button>
        </div>

        {/* Two Cards Side by Side */}
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-center mb-8">
          {/* Card 1 */}
          <div className={`
            w-full max-w-md
            transition-all duration-300
            ${hasVoted && selectedWinnerId === currentPair[0].id ? 'scale-105' : ''}
          `}>
            <FundCard
              fund={currentPair[0]}
              onClick={() => handleVote(currentPair[0].id, currentPair[1].id)}
              isClickable={!isVoting && !hasVoted}
              showGlow={hasVoted && selectedWinnerId === currentPair[0].id}
              showElo={hasVoted}
            />
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center lg:mx-4">
            <div className="bg-white px-6 py-3 rounded-full font-semibold text-slate-400 border border-gray-200">
              VS
            </div>
          </div>

          {/* Card 2 */}
          <div className={`
            w-full max-w-md
            transition-all duration-300
            ${hasVoted && selectedWinnerId === currentPair[1].id ? 'scale-105' : ''}
          `}>
            <FundCard
              fund={currentPair[1]}
              onClick={() => handleVote(currentPair[1].id, currentPair[0].id)}
              isClickable={!isVoting && !hasVoted}
              showGlow={hasVoted && selectedWinnerId === currentPair[1].id}
              showElo={hasVoted}
            />
          </div>
        </div>

        {/* Status and Next Button */}
        <div className="text-center mt-8">
          {isVoting && (
            <div className="flex items-center justify-center gap-2 text-slate-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Updating rankings...</span>
            </div>
          )}
          
          {hasVoted && !isVoting && (
            <Button 
              onClick={handleNext}
              size="lg"
              className="gap-2"
            >
              Next Matchup <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}