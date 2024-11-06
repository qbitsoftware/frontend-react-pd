import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "@tanstack/react-router"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-gray-900 text-white border-gray-800">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <FileQuestion className="w-12 h-12 text-gray-200" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Page Not Found</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-gray-300">
                        We're sorry, but the page you're looking for doesn't exist or has been moved.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Please check the URL or try navigating back to the homepage.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
                    <Link to="/" >
                        <Button
                            variant="outline"
                            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700 hover:text-gray-100"
                        >
                            <Home className="mr-2 h-4 w-4" /> Go to Homepage
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        onClick={() => window.history.back()}
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        Go Back
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}