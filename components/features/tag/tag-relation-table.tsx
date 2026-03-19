import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TagRelationDto } from "@/lib/api/generated";

type Props = {
  items: TagRelationDto[];
  totalRecords?: number;
  onEdit?: (relation: TagRelationDto) => void;
  onDelete?: (relation: TagRelationDto) => void;
};

export function TagRelationTable({ items, totalRecords, onEdit, onDelete }: Props) {
  return (
    <Card>
      <CardContent className="px-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">Tag Relations</h2>
            <p className="text-muted-foreground text-sm">{totalRecords ?? items.length} total records</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Root Tag</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground text-center">
                    No tag relations found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((relation) => (
                  <TableRow key={relation.tagGroupId ?? relation.tagGroupName}>
                    <TableCell className="font-medium">{relation.tagGroupName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{relation.description ?? "-"}</TableCell>
                    <TableCell>{relation.rootTagId ?? "-"}</TableCell>
                    <TableCell>
                      {relation.enableHyperTable ? <Badge>Hypertable</Badge> : relation.isView ? <Badge>View</Badge> : "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {relation.updateAt ? format(new Date(relation.updateAt), "yyyy-MM-dd HH:mm") : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(event) => {
                            event.preventDefault();
                            onEdit?.(relation);
                          }}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={(event) => {
                            event.preventDefault();
                            onDelete?.(relation);
                          }}>
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
