'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { Dumbbell, AlertCircle, CalendarClock, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface Exercise {
  name: string;
  setsReps?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  notes?: string;
}

interface WorkoutPlan {
  _id: string;
  name: string;
  description?: string;
  type: string;
  level: string;
  duration: number;
  exercises: Exercise[];
  created: string;
  active: boolean;
}

interface Attendance {
  _id: string;
  date: string;
  status: string;
}

// Custom CardFooter component
const CardFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("px-6 py-4 border-t border-gray-200 dark:border-gray-700", className)}>
      {children}
    </div>
  );
};

export default function WorkoutsPage() {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Fetch workout plan and attendance data
  useEffect(() => {
    const fetchWorkoutData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch workout plan data
        const planResponse = await api.get('/member/workout-plan');
        setWorkoutPlan(planResponse.data);
        
        // Fetch attendance data
        const attendanceResponse = await api.get('/member/attendance');
        setAttendance(attendanceResponse.data);
      } catch (err: any) {
        console.error('Error fetching workout data:', err);
        setError(err.response?.data?.message || 'Failed to load workout data');
        
        // If we're in development, use mock data
        if (process.env.NODE_ENV === 'development') {
          const mockWorkoutPlan = {
            _id: 'mock-plan-123',
            name: 'Beginner Strength Training',
            description: 'A beginner-friendly strength training plan',
            type: 'Workout',
            level: 'Beginner',
            duration: 8,
            exercises: [
              { name: 'Squats', sets: 3, reps: 10, weight: 0, notes: 'Focus on form' },
              { name: 'Push-ups', sets: 3, reps: 8, notes: 'Modify on knees if needed' },
              { name: 'Dumbbell Rows', sets: 3, reps: 12, weight: 10, notes: 'Pull elbows back' },
              { name: 'Plank', setsReps: '3 sets of 30 seconds', notes: 'Keep core tight' }
            ],
            created: new Date().toISOString(),
            active: true
          };
          
          const mockAttendance = [
            { _id: 'att-1', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Present' },
            { _id: 'att-2', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Present' },
            { _id: 'att-3', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Absent' }
          ];
          
          setWorkoutPlan(mockWorkoutPlan as WorkoutPlan);
          setAttendance(mockAttendance as Attendance[]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkoutData();
  }, []);

  // Mark attendance for today
  const markAttendance = async () => {
    setIsMarkingAttendance(true);
    
    try {
      const response = await api.post('/member/attendance');
      
      // Add the new attendance to the list
      setAttendance(prev => [response.data.attendance, ...prev]);
      
      toast({
        title: 'Workout Completed',
        description: 'Your workout has been marked as completed for today!'
      });
    } catch (err: any) {
      console.error('Error marking attendance:', err);
      
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to mark attendance'
      });
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  // Check if attendance is already marked for today
  const isAttendanceMarkedToday = () => {
    const today = new Date().toDateString();
    return attendance.some(a => new Date(a.date).toDateString() === today);
  };

  // Format dates to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">💪 My Workouts</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your workout plan and track your progress
        </p>
      </div>

      {error && !workoutPlan && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}

      {!workoutPlan ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <Dumbbell className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-center mb-2">No Workout Plan Assigned Yet</h3>
            <p className="text-gray-500 text-center mb-4">
              Your trainer hasn't assigned a workout plan to you yet. Check back later or contact your trainer.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/member/appointments'}>
              Book a Session with Trainer
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl font-bold">{workoutPlan.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {workoutPlan.level} • {workoutPlan.duration} Weeks
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${workoutPlan.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {workoutPlan.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {workoutPlan.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{workoutPlan.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold mb-3">Exercises</h3>
                <div className="space-y-4">
                  {workoutPlan.exercises.map((exercise, index) => (
                    <Card key={index} className="bg-gray-50 dark:bg-gray-800">
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{exercise.name}</h4>
                          {exercise.weight !== undefined && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {exercise.weight}kg
                            </Badge>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {exercise.setsReps || (exercise.sets && exercise.reps 
                            ? `${exercise.sets} sets × ${exercise.reps} reps` 
                            : 'Sets/reps not specified')}
                        </div>
                        {exercise.notes && (
                          <p className="mt-2 text-sm italic text-gray-500">
                            Note: {exercise.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={markAttendance}
                  disabled={isMarkingAttendance || isAttendanceMarkedToday()}
                  className="w-full"
                >
                  {isMarkingAttendance ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Marking...
                    </>
                  ) : isAttendanceMarkedToday() ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Workout Completed Today
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Today's Workout as Complete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  <div className="flex items-center">
                    <CalendarClock className="h-5 w-5 mr-2" />
                    Workout History
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attendance.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-gray-500">No workout history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendance.slice(0, 7).map((entry) => (
                      <div key={entry._id} className="flex items-center justify-between p-2 border-b">
                        <div className="text-sm">{formatDate(entry.date)}</div>
                        <Badge 
                          variant="outline" 
                          className={`${entry.status === 'Present' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}`}
                        >
                          {entry.status === 'Present' 
                            ? <CheckCircle2 className="h-3 w-3 inline mr-1" /> 
                            : <XCircle className="h-3 w-3 inline mr-1" />
                          }
                          {entry.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {attendance.length > 7 && (
                <CardFooter>
                  <Button variant="outline" className="w-full" size="sm">
                    View Full History
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
} 