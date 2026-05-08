import React from 'react';
import { MapPin, Clock, User, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationCard({ notification, canDismiss, onDismiss }) {
  const timeAgo = notification.created_date
    ? formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      layout
      className="relative bg-card rounded-2xl border border-border/60 p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      {canDismiss && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
          onClick={() => onDismiss?.(notification)}
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      {/* Active indicator */}
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
        </span>
        <span className="text-xs font-medium text-green-600">Available Now</span>
        <span className="text-xs text-muted-foreground ml-auto">{timeAgo}</span>
      </div>

      {/* Teacher name */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-base">{notification.teacher_name}</h3>
      </div>

      {/* Message */}
      {notification.message && (
        <p className="text-sm text-foreground/80 mb-3 leading-relaxed">
          {notification.message}
        </p>
      )}

      {/* Location */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-accent/70 border border-border/40">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <span className="text-sm font-medium text-accent-foreground">{notification.location}</span>
      </div>
    </motion.div>
  );
}