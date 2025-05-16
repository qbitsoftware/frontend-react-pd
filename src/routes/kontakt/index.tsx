import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Cpu, UserRound, Calendar } from "lucide-react";
export const Route = createFileRoute("/kontakt/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Contact
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <Card>
          <CardHeader>
            <CardTitle>
              <h4 className="flex gap-2">
                <Cpu /> Technical Coordinator
              </h4>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="flex gap-2">
              <strong>
                <UserRound />
              </strong>{" "}
              Markus Annuk
              <br />
            </p>
            <p className="flex gap-2">
              <strong>
                <Phone />
              </strong>{" "}
              +372 5558 4101
            </p>
            <p className="flex gap-2">
              <strong>
                <Mail />
              </strong>{" "}
              markus.annuk@pipedrive.com
            </p>
            <p className="flex gap-2">
              <strong>
                <Mail />
              </strong>{" "}
              markus@tournament10.com
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              <h4 className="flex gap-2">
                <Calendar /> Event Coordinator
              </h4>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="flex gap-2">
              <strong>
                <UserRound />
              </strong>{" "}
              Siimon Härm
              <br />
            </p>
            <p className="flex gap-2">
              <strong>
                <Phone />
              </strong>{" "}
              +372 5816 3187
            </p>
            <p className="flex gap-2">
              <strong>
                <Mail />
              </strong>{" "}
              siimon.harm@pipedrive.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
