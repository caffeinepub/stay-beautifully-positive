import { useState } from 'react';
import { toast } from 'sonner';
import { formatShareMessage } from '../utils/formatShareMessage';

/**
 * Custom hook for sharing affirmations with Web Share API and clipboard fallback
 */
export function useShareAffirmation() {
  const [isSharing, setIsSharing] = useState(false);

  const shareAffirmation = async (affirmationText: string) => {
    if (!affirmationText) {
      toast.error('No affirmation to share');
      return;
    }

    setIsSharing(true);

    try {
      const formattedMessage = formatShareMessage(affirmationText);

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: 'Daily Affirmation',
          text: formattedMessage,
        });
        toast.success('Shared successfully!');
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(formattedMessage);
        toast.success('Copied to clipboard!', {
          description: 'Share the affirmation with your friends',
        });
      }
    } catch (error: any) {
      // User cancelled share dialog or clipboard failed
      if (error.name === 'AbortError') {
        // User cancelled, no need to show error
        return;
      }
      
      console.error('Share error:', error);
      toast.error('Failed to share', {
        description: 'Please try again',
      });
    } finally {
      setIsSharing(false);
    }
  };

  return {
    shareAffirmation,
    isSharing,
  };
}
