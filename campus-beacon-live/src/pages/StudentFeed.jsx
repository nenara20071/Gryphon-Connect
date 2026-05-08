import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NotificationCard from '../components/notifications/NotificationCard';
import EmptyState from '../components/notifications/EmptyState';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

export default function StudentFeed() {
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['student-notifications'],
    queryFn: () => base44.entities.Notification.filter({ is_active: true }, '-created_date', 50),
    refetchInterval: 15000, // Auto-refresh every 15 seconds
  });

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = base44.entities.Notification.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ['student-notifications'] });
    });
    return unsubscribe;
  }, [queryClient]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold tracking-tight">Office Hours</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Teachers currently available for questions
        </p>
      </motion.div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No one available right now"
          description="When a teacher starts office hours, their notification will appear here in real time."
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.map(n => (
              <NotificationCard key={n.id} notification={n} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}