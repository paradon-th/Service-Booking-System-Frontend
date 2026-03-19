'use client'

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import UserManagementTable from "./userManagementTable";

export default function UserManagement() {

    return (
            <div className="px-4 pt-2 pb-2">
                <h1 className="font-bold text-2xl">User Management</h1>
                    <div className="p-6 border rounded-2xl mt-4 shadow-sm"><UserManagementTable /></div>
            </div>
    );
}