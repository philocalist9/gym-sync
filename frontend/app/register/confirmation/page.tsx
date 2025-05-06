'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto max-w-2xl py-20 px-4">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
          <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
        
        <h1 className="text-3xl font-bold">Application Submitted!</h1>
        
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Thank you for registering your gym with Gym-Sync. Your application has been received and is pending review by our administrators.
        </p>
        
        <div className="grid gap-4 pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You will receive an email notification once your application has been processed.
            This typically takes 1-2 business days.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
            <Button asChild variant="outline">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
            
            <Button asChild>
              <Link href="/login">
                Go to Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 