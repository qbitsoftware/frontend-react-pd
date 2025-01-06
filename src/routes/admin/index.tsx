import {
    LayoutDashboard,
    Trophy,
    Users,
    FileText,
    Settings,
    PlusCircle,
    Edit,
    Trash,
    Users as UsersIcon,
    AlertCircle,

} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from '@tanstack/react-router'
import AdminTournament from './-components/tournaments';
import { useState } from 'react';
import { UseGetTournaments } from '@/queries/tournaments';

export const Route = createFileRoute('/admin/')({
    loader: async({context: {queryClient}}) => {
        const tournaments_data = await queryClient.ensureQueryData(
            UseGetTournaments()
        )

        return {tournaments_data}
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {tournaments_data} = Route.useLoaderData()
    const [activeSection, setActiveSection] = useState('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
        { id: 'tournaments', label: 'Tournaments', icon: <Trophy className="w-4 h-4 mr-2" /> },
        { id: 'teams', label: 'Teams', icon: <Users className="w-4 h-4 mr-2" /> },
        { id: 'blog', label: 'Blog', icon: <FileText className="w-4 h-4 mr-2" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 mr-2" /> },
    ];

    const mockStats = {
        totalTournaments: 45,
        activeTournaments: 3,
        totalTeams: 128,
        totalUsers: 512,
        recentSignups: 24,
        pendingApprovals: 8
    };

    const mockTeams = [
        { id: 1, name: 'Team Alpha', members: 5, status: 'Active', region: 'Europe' },
        { id: 2, name: 'Digital Dragons', members: 4, status: 'Pending', region: 'Asia' },
        { id: 3, name: 'Victory Squad', members: 6, status: 'Active', region: 'Americas' },
    ];

    const mockBlogs = [
        { id: 1, title: 'Tournament Tips & Tricks', status: 'Published', date: '2024-03-15', author: 'John Doe' },
        { id: 2, title: 'Upcoming Season Preview', status: 'Draft', date: '2024-03-16', author: 'Jane Smith' },
        { id: 3, title: 'Community Spotlight', status: 'Published', date: '2024-03-14', author: 'Mike Johnson' },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-gray-900">Tournament Hub</h1>
                    <p className="text-sm text-gray-500 mt-1">Administration</p>
                </div>
                <nav className="mt-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            className={`w-full flex items-center px-6 py-3 text-sm transition-colors duration-150 ${activeSection === item.id
                                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {menuItems.find(item => item.id === activeSection)?.label}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {activeSection === 'dashboard' && 'Overview of your tournament system'}
                                {activeSection === 'tournaments' && 'Manage and organize tournaments'}
                                {activeSection === 'teams' && 'Handle team registrations and management'}
                                {activeSection === 'blog' && 'Create and manage blog content'}
                                {activeSection === 'settings' && 'Configure system preferences'}
                            </p>
                        </div>
                    </div>
                    {/* Dashboard Content */}
                    {activeSection === 'dashboard' && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center space-x-4">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Trophy className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold">{mockStats.totalTournaments}</CardTitle>
                                            <CardDescription>Total Tournaments</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center space-x-4">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <UsersIcon className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold">{mockStats.totalTeams}</CardTitle>
                                            <CardDescription>Registered Teams</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center space-x-4">
                                        <div className="p-2 bg-yellow-100 rounded-lg">
                                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-bold">{mockStats.pendingApprovals}</CardTitle>
                                            <CardDescription>Pending Approvals</CardDescription>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600">• New team registration: Team Alpha (2 minutes ago)</p>
                                        <p className="text-sm text-gray-600">• Tournament "Summer Championship" started (1 hour ago)</p>
                                        <p className="text-sm text-gray-600">• Blog post published: "Tournament Tips" (3 hours ago)</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Teams Content */}
                    {activeSection === 'teams' && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Add New Team
                                </Button>
                            </div>

                            <div className="grid gap-6">
                                {mockTeams.map((team) => (
                                    <Card key={team.id}>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle>{team.name}</CardTitle>
                                                <CardDescription>Region: {team.region}</CardDescription>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-red-600">
                                                    <Trash className="w-4 h-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Members</p>
                                                    <p className="mt-1 font-medium">{team.members}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Status</p>
                                                    <p className={`mt-1 font-medium ${team.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                                                        }`}>{team.status}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Blog Content */}
                    {activeSection === 'blog' && (
                        <div className="space-y-6">
                            <div className="flex justify-end">
                                <Button className="flex items-center bg-blue-600 hover:bg-blue-700 text-white">
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    New Blog Post
                                </Button>
                            </div>

                            <div className="grid gap-6">
                                {mockBlogs.map((blog) => (
                                    <Card key={blog.id}>
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <div>
                                                <CardTitle>{blog.title}</CardTitle>
                                                <CardDescription>By {blog.author} • {blog.date}</CardDescription>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-red-600">
                                                    <Trash className="w-4 h-4 mr-2" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-center space-x-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {blog.status}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Settings Content */}
                    {activeSection === 'settings' && (
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>General Settings</CardTitle>
                                    <CardDescription>Manage your tournament platform settings</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-medium">Site Information</h3>
                                        <div className="grid gap-4">
                                            <div>
                                                <label className="text-sm font-medium">Site Name</label>
                                                <input type="text" className="w-full mt-1 p-2 border rounded-md" defaultValue="Tournament Hub" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Site Description</label>
                                                <textarea className="w-full mt-1 p-2 border rounded-md" rows={3} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium">Tournament Settings</h3>
                                        <div className="grid gap-4">
                                            <div className="flex items-center space-x-2">
                                                <input type="checkbox" id="autoApprove" />
                                                <label htmlFor="autoApprove">Auto-approve team registrations</label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input type="checkbox" id="emailNotifications" />
                                                <label htmlFor="emailNotifications">Enable email notifications</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium">Contact Information</h3>
                                        <div className="grid gap-4">
                                            <div>
                                                <label className="text-sm font-medium">Support Email</label>
                                                <input type="email" className="w-full mt-1 p-2 border rounded-md" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Contact Phone</label>
                                                <input type="tel" className="w-full mt-1 p-2 border rounded-md" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Tournaments Content */}
                    {activeSection === 'tournaments' && (
                      <AdminTournament tournaments={tournaments_data.data} />
                    )}
                </div>
            </div>
        </div>
    );
};
