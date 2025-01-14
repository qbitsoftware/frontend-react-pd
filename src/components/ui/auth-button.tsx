import { useGetLogin, useLogout } from "@/queries/users"
import { Button } from "./button"
import { Link, useNavigate } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

interface AuthButtonProps {
    className?: string
}

export const AuthButton:React.FC<AuthButtonProps> = ({className}) => {
    const navigate = useNavigate()
    const logout = useLogout()
    const { data: userData } = useGetLogin()

    const handleLogout = async () => {
        try {
            await logout.mutateAsync()
            navigate({to: "/"})
        } catch (error) {
            console.error(error)
        }
    }

    if (userData?.data) {
        return <Button variant="secondary" className="text-white rounded-xl px-6  hover:bg-secondary" onClick={handleLogout}>Logi välja</Button>
    } else {
        return (
            <Link to="/login">
                <Button variant="secondary" className={cn("text-white rounded-xl px-6  hover:bg-secondary", className)}>Logi sisse</Button>
            </Link>
        )
    }
}