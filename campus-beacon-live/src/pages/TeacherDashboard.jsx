import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SendNotificationForm from '../components/notifications/SendNotificationForm';
import NotificationCard from '../components/notifications/NotificationCard';
import EmptyState from '../components/notifications/EmptyState';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  const { data: myNotifications = [] } = useQuery({
    queryKey: ['my-notifications', user?.email],
    queryFn: () => base44.entities.Notification.filter({ teacher_email: user.email }, '-created_date', 20),
    enabled: !!user?.email,
  });

  const activeNotifications = myNotifications.filter(n => n.is_active);
  const pastNotifications = myNotifications.filter(n => !n.is_active);

  const handleDismiss = async (notification) => {
    await base44.entities.Notification.update(notification.id, { is_active: false });
    queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
    toast.success('Notification ended');
  };

  const handleSent = () => {
    queryClient.invalidateQueries({ queryKey: ['my-notifications'] });
  };

  return (
    <div className="space-y-8">
      <SendNotificationForm user={user} onSent={handleSent} />

      {/* Active notifications */}
      {activeNotifications.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Currently Active
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {activeNotifications.map(n => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  canDismiss
                  onDismiss={handleDismiss}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Past notifications */}
      {pastNotifications.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Past Sessions
          </h3>
          <div className="space-y-3 opacity-60">
            {pastNotifications.slice(0, 5).map(n => (
              <NotificationCard key={n.id} notification={n} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}