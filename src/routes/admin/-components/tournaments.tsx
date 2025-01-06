import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import TournamentCard from './tournament';
import React from 'react';
import { Trophy } from 'lucide-react';
import { Tournament } from '@/types/types';

interface AdminTournamentProps {
    tournaments: Tournament[] | null
}

const AdminTournament: React.FC<AdminTournamentProps> = ({ tournaments }) => {
    if (!tournaments) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <Trophy className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Tournaments Found</h3>
                <p className="text-gray-500 text-center max-w-md">
                    There are currently no tournaments to display. Create a new tournament to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Tournament
            </Button>

            <Card className="p-4">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search tournaments..."
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <select className="px-3 py-2 border rounded-md">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="draft">Draft</option>
                    </select>
                    <select className="px-3 py-2 border rounded-md">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </Card>

            <div className="grid gap-6">
                {tournaments.map((tournament) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                ))}
            </div>
        </div>
    )
}

export default AdminTournament