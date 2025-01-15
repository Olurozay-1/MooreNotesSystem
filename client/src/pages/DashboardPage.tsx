
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, UserMinus, Users } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const chartData = {
    labels: ['1 Apr', '8 Apr', '15 Apr', '22 Apr', '29 Apr'],
    datasets: [
      {
        label: 'Incidents',
        data: [4, 3, 2, 5, 1],
        borderColor: 'rgb(99, 102, 241)',
        tension: 0.4,
      },
      {
        label: 'Missing Reports',
        data: [1, 0, 1, 2, 0],
        borderColor: 'rgb(34, 197, 94)',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 2,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents (30d)</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Reports (30d)</CardTitle>
            <UserMinus className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Residents</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>30-Day Incident Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={chartData} options={chartOptions} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-1" />
                <div>
                  <p className="font-medium">Incident</p>
                  <p className="text-sm text-muted-foreground">New incident report filed for Room 2</p>
                  <p className="text-xs text-muted-foreground">10 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <UserMinus className="h-4 w-4 text-red-500 mt-1" />
                <div>
                  <p className="font-medium">Missing</p>
                  <p className="text-sm text-muted-foreground">Missing person report resolved - John returned</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="h-4 w-4 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium">General</p>
                  <p className="text-sm text-muted-foreground">Monthly safety inspection completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
