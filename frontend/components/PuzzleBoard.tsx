'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessground } from 'chessground';
import 'chessground/assets/chessground.base.css';
import 'chessground/assets/chessground.brown.css';
import 'chessground/assets/chessground.cburnett.css';
import { apiFetch } from '../services/api';

type PuzzleBoardProps = {
  puzzle: {
    id: string;
    fenPosition: string;
    solutionMoves: string[];
  };
};

export function PuzzleBoard({ puzzle }: PuzzleBoardProps) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const cgRef = useRef<any>(null);
  const stepRef = useRef(0);
  const game = useMemo(() => new Chess(puzzle.fenPosition), [puzzle.fenPosition]);
  const [feedback, setFeedback] = useState('Make the best move.');

  useEffect(() => {
    stepRef.current = 0;
    setFeedback('Make the best move.');

    if (!boardRef.current) return;

    const syncBoard = () => {
      cgRef.current?.set({
        fen: game.fen(),
        turnColor: game.turn() === 'w' ? 'white' : 'black',
        movable: { color: game.turn() === 'w' ? 'white' : 'black', dests: toDests(game) }
      });
    };

    cgRef.current = Chessground(boardRef.current, {
      fen: game.fen(),
      turnColor: game.turn() === 'w' ? 'white' : 'black',
      movable: {
        color: game.turn() === 'w' ? 'white' : 'black',
        free: false,
        dests: toDests(game),
        events: {
          after: (orig: string, dest: string) => {
            const attempted = `${orig}${dest}`;
            const expected = puzzle.solutionMoves[stepRef.current];
            const move = game.move({ from: orig, to: dest, promotion: 'q' });

            if (!move) {
              setFeedback('Illegal move.');
              syncBoard();
              return;
            }

            if (attempted === expected) {
              stepRef.current += 1;
              const solved = stepRef.current >= puzzle.solutionMoves.length;
              setFeedback(solved ? 'Puzzle solved!' : 'Correct move!');
              if (solved) {
                apiFetch('/attempts', {
                  method: 'POST',
                  body: JSON.stringify({ puzzle_id: puzzle.id, solved: true })
                }).catch(() => null);
              }
            } else {
              setFeedback('Wrong move, try again.');
              game.undo();
              apiFetch('/attempts', {
                method: 'POST',
                body: JSON.stringify({ puzzle_id: puzzle.id, solved: false })
              }).catch(() => null);
            }

            syncBoard();
          }
        }
      }
    });

    return () => cgRef.current?.destroy();
  }, [game, puzzle.id, puzzle.solutionMoves]);

  return (
    <div className="space-y-3">
      <div ref={boardRef} className="h-[420px] w-[420px]" />
      <p className="text-sm text-emerald-300">{feedback}</p>
    </div>
  );
}

function toDests(chess: Chess): Map<string, string[]> {
  const dests = new Map<string, string[]>();
  chess.SQUARES.forEach((square) => {
    const moves = chess.moves({ square, verbose: true });
    if (moves.length) dests.set(square, moves.map((m) => m.to));
  });
  return dests;
}
