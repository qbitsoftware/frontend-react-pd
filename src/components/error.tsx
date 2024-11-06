import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, ArrowLeft, Server } from "lucide-react"
import { Link, useRouter } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {

    const router = useRouter()
    const queryErrorResetBoundary = useQueryErrorResetBoundary()

    useEffect(() => {
      // Reset the query error boundary
      queryErrorResetBoundary.reset()
    }, [queryErrorResetBoundary])

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <Card className="w-full bg-secondary max-w-md border-gray-800">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-12 h-12 text-gray-200" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Oih! Midagi läks valesti</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="">Vabandame ebamugavuste pärast. Tegeleme probleemi lahendamisega.</p>
                    <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <Server className="w-4 h-4" />
                        <span className="text-sm">Error: {error.message || "Unknown server error"}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center space-x-4">
                    <Button
                        variant="outline"
                        onClick={() => router.invalidate()}
                        className="text-black border-gray-700 hover:bg-gray-700 hover:text-gray-100"
                    >
                        Proovi uuesti
                    </Button>
                    <Link to="/" >
                        <Button
                            variant="ghost"
                            className=" hover:text-white hover:bg-gray-800"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Mine kodulehele
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}