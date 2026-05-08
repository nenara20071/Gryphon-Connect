import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import TeacherDashboard from './TeacherDashboard';
import StudentFeed from './StudentFeed';

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  return isTeacher ? <TeacherDashboard /> : <StudentFeed />;
}