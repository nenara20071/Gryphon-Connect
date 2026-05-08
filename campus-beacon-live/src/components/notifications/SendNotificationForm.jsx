import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function SendNotificationForm({ user, onSent }) {
  const [location, setLocation] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!location.trim()) {
      toast.error('Please enter your location');
      return;
    }

    setSending(true);
    await base44.entities.Notification.create({
      teacher_name: user.full_name || 'A Teacher',
      teacher_email: user.email,
      location: location.trim(),
      message: message.trim() || 'I\'m available for questions!',
      is_active: true,
    });

    toast.success('Students have been notified!');
    setLocation('');
    setMessage('');
    setSending(false);
    onSent?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border/60 p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold mb-1">Notify Students</h2>
      <p className="text-sm text-muted-foreground mb-5">
        Let students know you're available for office hours.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Where are you? *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="e.g. Room 204, Library 2nd floor, Zoom link..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            Message <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            id="message"
            placeholder="e.g. Available for the next hour, bring your homework..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        <Button
          onClick={handleSend}
          disabled={sending}
          className="w-full h-12 text-base font-semibold rounded-xl gap-2"
          size="lg"
        >
          {sending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
          {sending ? 'Sending...' : 'Send Notification'}
        </Button>
      </div>
    </motion.div>
  );
}