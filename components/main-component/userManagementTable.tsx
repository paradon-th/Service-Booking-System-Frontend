"use client";

import { useEffect, useState } from "react";
import SelectCustom from "../custom-component/selectCustom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Dot, MoreHorizontal, Settings, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

interface User {
    id: number;
    username: string;
    email: string;
    role: {
        name: string;
    };
    createdAt: string;
}

function RoleBadge({ roleName }: { roleName: string }) {
    let bgColor = "bg-[#E8E9FF] text-[#543DA7] border border-[#D9DBFF]";
    if (roleName === "Administrator") {
        bgColor = "bg-[#FFF3E8] text-[#A76E3D] border border-[#FFEDD9]";
    } else if (roleName === "Viewer") {
        bgColor = "bg-[#E8F8FF] text-[#3D90A7] border border-[#D9F9FF]";
    }

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${bgColor}`}>
            {roleName}
        </span>
    );
}

export default function UserManagementTable() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
    const [emailOptions, setEmailOptions] = useState<{ value: string; label: string }[]>([]);
    const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
    
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const skeletonColumns = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                const data: User[] = await response.json();
                setUsers(data);
                setFilteredUsers(data);

                const uniqueUsernames = Array.from(new Set(data.map(user => user.username))).map(name => ({ value: name, label: name }));
                const uniqueEmails = Array.from(new Set(data.map(user => user.email))).map(email => ({ value: email, label: email }));
                const uniqueRoleNames = Array.from(new Set(data.map(user => user.role?.name))).filter(Boolean).map(role => ({ value: role, label: role }));

                setUserOptions(uniqueUsernames);
                setEmailOptions(uniqueEmails);
                setRoleOptions(uniqueRoleNames);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        let newFilteredUsers = [...users];

        if (selectedUsers.length > 0) {
            newFilteredUsers = newFilteredUsers.filter(user => selectedUsers.includes(user.username));
        }
        if (selectedEmails.length > 0) {
            newFilteredUsers = newFilteredUsers.filter(user => selectedEmails.includes(user.email));
        }
        if (selectedRoles.length > 0) {
            newFilteredUsers = newFilteredUsers.filter(user => user.role && selectedRoles.includes(user.role.name));
        }

        setFilteredUsers(newFilteredUsers);
    }, [selectedUsers, selectedEmails, selectedRoles, users]);

    const renderSkeletonRows = () =>
        [...Array(5)].map((_, rowIdx) => (
            <TableRow key={`user-skeleton-${rowIdx}`}>
                {[...Array(skeletonColumns)].map((__, colIdx) => (
                    <TableCell key={`user-skeleton-cell-${rowIdx}-${colIdx}`}>
                        <Skeleton className="h-5 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        ));


    return (
        <div className="w-full">
            <div className="[&>div]:rounded-md [&>div]:border [&>div]:max-h-[calc(100vh-220px)] [&>div]:overflow-y-auto">
                <Table>
                    <TableHeader className="*:whitespace-nowrap sticky top-0 z-50 bg-denso-dark">
                        <TableRow>
                            <TableHead className="w-3/12 py-3">
                                <div className="py-1 text-white">User</div>
                                <SelectCustom options={userOptions} label="" placeholder="Select User" selectType="actualProduction" multi={true} onChange={(value) => setSelectedUsers(value as string[])} />
                            </TableHead>

                            <TableHead className="w-3/12 py-3">
                                <div className="py-1 text-white">Email</div>
                                <SelectCustom options={emailOptions} label="" placeholder="Select Email" selectType="actualProduction" multi={true} onChange={(value) => setSelectedEmails(value as string[])} />
                            </TableHead>

                            <TableHead className="w-2/12 py-3">
                                <div className="py-1 text-white">Role</div>
                                <SelectCustom options={roleOptions} label="" placeholder="Select Role" selectType="actualProduction" multi={true} onChange={(value) => setSelectedRoles(value as string[])} />
                            </TableHead>

                            <TableHead className="w-3/12 py-3 text-center">
                                <div className="py-1 text-white">Created Date</div>
                                <div className="h-10"></div> {/* Spacer for alignment */}
                            </TableHead>

                            <TableHead className="w-1/12 py-3 text-center align-middle">
                                <div className="py-1 text-white">Action</div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            renderSkeletonRows()
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-red-500">{error}</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <RoleBadge roleName={user.role?.name || "No Role"} />
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="secondary" className="h-8 w-10 p-0 rounded-xl bg-gray-100">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-1" align="end">
                                                <div className="flex flex-col gap-1">
                                                    <Button variant="ghost" className="justify-start h-8 text-sm"><Settings className="mr-2 h-4 w-4" />Setting</Button>
                                                    <Button variant="ghost" className="justify-start h-8 text-sm text-red-500"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}