import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Search } from 'lucide-react';
import TournamentCard from './tournament';
import React, { useState } from 'react';
import { Tournament } from '@/types/types';
import { Link } from '@tanstack/react-router';

interface AdminTournamentProps {
    tournaments: Tournament[]
}

const AdminTournament: React.FC<AdminTournamentProps> = ({ tournaments }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [status, setStatus] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    const filteredTournaments = tournaments
        .filter(tournament => {
            const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = status === 'all' ? true : tournament.state === status;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
            }
            return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Link href="/admin/tournaments/new">
                    <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Tournament
                    </Button>
                </Link>
            </div>

            <Card className="p-4">
                <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:gap-4">
                    <div className="flex-1 relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tournaments..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <select
                            className="px-3 py-2 border rounded-md"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="started">Active</option>
                            <option value="completed">Completed</option>
                            <option value="draft">Draft</option>
                        </select>
                        <select
                            className="px-3 py-2 border rounded-md"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </Card>

            <div className="grid gap-6">
                {filteredTournaments.map((tournament, index) => (
                    <TournamentCard key={index} tournament={tournament} />
                ))}
            </div>
        </div>
    )
}

export default AdminTournament