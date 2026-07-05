"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical, ShieldBan, ShieldCheck, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  banned_until?: string;
  resumeCount: number;
};

export default function UsersTable({ users }: { users: AdminUser[] }) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleAction = async (action: "ban" | "unban" | "delete", userId: string) => {
    if (action === "delete" && !confirm("Are you sure you want to delete this user? This cannot be undone.")) {
      return;
    }

    setLoadingAction(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, targetUserId: userId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Action failed");

      toast({
        title: "Success",
        description: data.message,
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">User Email</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Status</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Resumes</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Signup Date</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Last Login</th>
              <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {users.length > 0 ? (
              users.map((u) => {
                const isBanned = !!u.banned_until;
                const isLoading = loadingAction === u.id;
                
                return (
                  <tr key={u.id} className={`hover:bg-slate-50/50 ${isLoading ? "opacity-50" : ""}`}>
                    <td className="py-4 px-6 font-medium text-slate-700">
                      {u.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isBanned ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {isBanned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {u.resumeCount}
                    </td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                      {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "Never"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger disabled={isLoading} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                          <MoreVertical className="w-4 h-4 text-slate-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isBanned ? (
                            <DropdownMenuItem onClick={() => handleAction("unban", u.id)} className="cursor-pointer text-green-600 focus:text-green-700">
                              <ShieldCheck className="w-4 h-4 mr-2" />
                              Unban User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleAction("ban", u.id)} className="cursor-pointer text-orange-600 focus:text-orange-700">
                              <ShieldBan className="w-4 h-4 mr-2" />
                              Ban User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleAction("delete", u.id)} className="cursor-pointer text-red-600 focus:text-red-700">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
