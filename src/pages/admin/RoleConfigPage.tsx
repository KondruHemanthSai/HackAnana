import React, { useState } from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const RoleConfigPage = () => {
    const { user, setUserRole } = useAuth();
    const [emailToPromote, setEmailToPromote] = useState('');
    const [selectedRole, setSelectedRole] = useState<UserRole>('super_admin');
    const [loading, setLoading] = useState(false);

    // Function to promote the CURRENT user (Self-Service for setup)
    const handlePromoteSelf = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await setUserRole('super_admin');
            toast.success('You represent the Authority now! (Role set to Super Admin)');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update role');
        } finally {
            setLoading(false);
        }
    };

    // Function to find another user by email and promote them
    const handlePromoteByEmail = async () => {
        if (!emailToPromote.trim() || !db) return;
        setLoading(true);
        try {
            // 1. Find the user ID by email
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', emailToPromote.trim()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                toast.error('User not found. They must login at least once.');
                setLoading(false);
                return;
            }

            // 2. Update their role
            const targetUserDoc = querySnapshot.docs[0];
            await updateDoc(targetUserDoc.ref, { role: selectedRole });

            toast.success(`Updated ${emailToPromote} to ${selectedRole}`);
            setEmailToPromote('');
        } catch (error) {
            console.error("Error promoting user:", error);
            toast.error("Failed to promote user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6 flex flex-col items-center">
            <header className="w-full max-w-md mb-8 flex items-center gap-4">
                <Link to="/" className="p-2 rounded-xl bg-muted">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-bold">Admin Setup</h1>
            </header>

            <div className="w-full max-w-md space-y-8">
                {/* Section 1: Self Promotion */}
                <div className="glass-panel p-6 rounded-2xl space-y-4 border border-primary/20">
                    <div className="flex items-center gap-3 text-primary">
                        <Shield className="w-8 h-8" />
                        <h2 className="text-xl font-bold">Self Promotion</h2>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Current Role: <span className="font-bold text-foreground">{user?.role}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Use this to become a Super Admin immediately for setup.
                    </p>
                    <Button
                        onClick={handlePromoteSelf}
                        disabled={loading || user?.role === 'super_admin'}
                        className="w-full gradient-primary"
                    >
                        Make Me Super Admin
                    </Button>
                </div>

                {/* Section 2: Promote Others */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                    <h2 className="text-xl font-bold">Promote Others</h2>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">User Email</label>
                        <input
                            type="email"
                            value={emailToPromote}
                            onChange={(e) => setEmailToPromote(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full p-3 rounded-xl bg-muted outline-none focus:ring-2 ring-primary/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Role</label>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                            className="w-full p-3 rounded-xl bg-muted outline-none"
                        >
                            <option value="student">Student</option>
                            <option value="food_admin">Food Admin</option>
                            <option value="resource_admin">Resource Admin</option>
                            <option value="super_admin">Super Admin</option>
                        </select>
                    </div>

                    <Button
                        onClick={handlePromoteByEmail}
                        disabled={loading || !emailToPromote}
                        variant="secondary"
                        className="w-full"
                    >
                        Update User Role
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoleConfigPage;
