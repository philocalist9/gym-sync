'use client';

import Card from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SettingsAltPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alternative Settings Page</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This is a simpler version of the settings page
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>General Settings</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>This is a test card to verify rendering on the alternative settings page.</p>
        </Card.Content>
      </Card>
    </div>
  );
} 