import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ProfileSetupDialogProps {
    open: boolean;
}

export default function ProfileSetupDialog({ open }: ProfileSetupDialogProps) {
    const [name, setName] = useState('');
    const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim()) {
            toast.error('Please enter your name');
            return;
        }

        saveProfile({ name: name.trim() }, {
            onSuccess: () => {
                toast.success('Welcome!', {
                    description: 'Your profile has been set up.',
                });
            },
            onError: (error: any) => {
                toast.error('Failed to save profile', {
                    description: error.message || 'Please try again.',
                });
            }
        });
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Welcome! 👋</DialogTitle>
                        <DialogDescription>
                            Let's get to know you. What should we call you?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Your Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="mt-2"
                            autoFocus
                            disabled={isPending}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending || !name.trim()} className="w-full">
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Continue'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
