"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Role {
  id: number;
  name: string;
  description: string;
}

interface RolePermission {
  permissionId: number;
  functionId: number;
  name: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

interface SystemPermission {
  id: number;
  name: string;
  functionId: number;
  description: string;
}

export default function RoleManagementPage() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await fetch("/api/roles");
      const data = await res.json();
      if (data.data) {
        setRoles(data.data);
        if (data.data.length > 0 && !selectedRoleId) {
          setSelectedRoleId(data.data[0].id.toString());
        }
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch roles", variant: "destructive" });
    }
  }, [selectedRoleId, toast]);

  const fetchPermissions = useCallback(async (roleId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/roles/${roleId}/permissions`);
      const data = await res.json();
      if (data.data) {
        const allSystem: SystemPermission[] = data.data.allSystemPermissions;
        const currentRole: RolePermission[] = data.data.permissions;

        const merged: RolePermission[] = allSystem.map(sys => {
          const roleP = currentRole.find(rp => rp.permissionId === sys.id);
          return {
            permissionId: sys.id,
            functionId: sys.functionId,
            name: sys.name,
            canRead: roleP?.canRead || false,
            canCreate: roleP?.canCreate || false,
            canUpdate: roleP?.canUpdate || false,
            canDelete: roleP?.canDelete || false,
          };
        });
        
        setPermissions(merged);
      }
    } catch {
      toast({ title: "Error", description: "Failed to fetch permissions", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    if (selectedRoleId) {
      fetchPermissions(selectedRoleId);
    }
  }, [selectedRoleId, fetchPermissions]);

  const togglePermission = (index: number, field: keyof RolePermission) => {
    const next = [...permissions];
    const item = { ...next[index] };
    (item[field] as boolean) = !(item[field] as boolean);
    next[index] = item;
    setPermissions(next);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/roles/${selectedRoleId}/permissions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(permissions),
      });
      if (res.ok) {
        toast({ title: "Success", description: "Permissions updated successfully", variant: "default" });
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast({ title: "Error", description: "Failed to save permissions", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permissions Matrix</CardTitle>
              <CardDescription>Configure granular access for each user role.</CardDescription>
            </div>
            <div className="w-[200px]">
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Module / Function</TableHead>
                    <TableHead className="text-center">Read</TableHead>
                    <TableHead className="text-center">Create</TableHead>
                    <TableHead className="text-center">Update</TableHead>
                    <TableHead className="text-center">Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((perm, index) => (
                    <TableRow key={perm.permissionId}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-blue-500" />
                          {perm.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={perm.canRead} 
                          onCheckedChange={() => togglePermission(index, "canRead")} 
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={perm.canCreate} 
                          onCheckedChange={() => togglePermission(index, "canCreate")} 
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={perm.canUpdate} 
                          onCheckedChange={() => togglePermission(index, "canUpdate")} 
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={perm.canDelete} 
                          onCheckedChange={() => togglePermission(index, "canDelete")} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {permissions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No permissions found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end border-t p-6">
          <Button disabled={isSaving || isLoading} onClick={handleSave} className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
