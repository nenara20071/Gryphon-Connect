import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { GraduationCap, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RoleSelect() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setLoading(false);
      // Auto-redirect based on role
      if (u?.role === 'teacher' || u?.role === 'admin') {
        navigate('/teacher');
      } else if (u?.role === 'student') {
        navigate('/student');
      }
    });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // If role not set, show picker
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to OfficeHours</h1>
        <p className="text-muted-foreground">Choose how you're using the app</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate('/teacher')}
          className="flex flex-col items-center gap-4 p-8 bg-card border-2 border-border hover:border-primary hover:bg-accent/30 rounded-2xl transition-all group"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">I'm a Teacher</p>
            <p className="text-sm text-muted-foreground mt-1">Send availability alerts</p>
          </div>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/student')}
          className="flex flex-col items-center gap-4 p-8 bg-card border-2 border-border hover:border-primary hover:bg-accent/30 rounded-2xl transition-all group"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">I'm a Student</p>
            <p className="text-sm text-muted-foreground mt-1">See who's available now</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}