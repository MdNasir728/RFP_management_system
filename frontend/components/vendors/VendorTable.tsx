import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Vendor } from "@/types/api.types";

interface VendorTableProps {
  vendors: Vendor[];
  loading: boolean;
}

export function VendorTable({ vendors, loading }: VendorTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        Loading vendors...
      </div>
    );
  }

  if (!vendors.length) {
    return (
      <div className="rounded-lg border p-4 text-sm text-muted-foreground">
        No vendors found. Create your first vendor to get started.
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor._id}>
              <TableCell className="font-medium">
                {vendor.name}
              </TableCell>
              <TableCell>{vendor.companyName || "-"}</TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>{vendor.phoneNumber || "-"}</TableCell>
              <TableCell>
                {new Date(vendor.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
